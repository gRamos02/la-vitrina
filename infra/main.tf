provider "oci" {
    region              = var.region //En parte 1 hardcodear 
    auth                = "SecurityToken"
    config_file_profile = "vitrina"
}

resource "oci_core_instance" "la_vitrina_server" {
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  compartment_id      = var.tenancy_ocid
#   shape               = "VM.Standard.E2.1.Micro"
  shape               = "VM.Standard3.Flex"

  create_vnic_details {
    subnet_id        = oci_core_subnet.vcn_subnet.id
    assign_public_ip = true
    display_name     = "la-vitrina-vnic"
  }

  display_name = "la-vitrina-instance"
  metadata = {
    # ssh_authorized_keys = var.ssh_public_key
    ssh_authorized_keys = file("./la_vitrina_oci.pub") # Ruta a tu clave pública SSH
  }

  shape_config {
    ocpus         = 1          # Puedes ajustar según disponibilidad y necesidad
    memory_in_gbs = 6          # Mínimo 6 GB para 1 OCPU en este shape
  }

  source_details {
    source_type = "image"
    # source_id   = data.oci_core_images.ubuntu_image.images[0].id
    source_id = "ocid1.image.oc1.iad.aaaaaaaaylsmeurrokhxpgd2kg6akdd2qkuoryzauxart5ruowwgn3gpaxua"
  }
}

# Recursos necesarios adicionales
data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

resource "oci_core_virtual_network" "vcn" {
  cidr_block     = "10.0.0.0/16"
  compartment_id = var.tenancy_ocid
  display_name   = "la-vitrina-vcn"
}

resource "oci_core_subnet" "vcn_subnet" {
  cidr_block        = "10.0.1.0/24"
  compartment_id    = var.tenancy_ocid
  vcn_id            = oci_core_virtual_network.vcn.id
  display_name      = "la-vitrina-subnet"
  security_list_ids = [
    oci_core_virtual_network.vcn.default_security_list_id,
    oci_core_security_list.vitrina_sec_list.id
  ]
  prohibit_public_ip_on_vnic = false
  prohibit_internet_ingress = false
}

resource "oci_core_internet_gateway" "la_vitrina_internet_gateway" {
  compartment_id = var.tenancy_ocid
  vcn_id         = oci_core_virtual_network.vcn.id
  display_name   = "la-vitrina-internet-gateway" 
}

resource "oci_core_default_route_table" "la_vitrina_route_table" {
  compartment_id             = var.tenancy_ocid 
  manage_default_resource_id = oci_core_virtual_network.vcn.default_route_table_id
  display_name              = "la-vitrina-default-route-table"

  route_rules {
    destination       = "0.0.0.0/0"
    description      = "Ruta para tráfico de Internet"
    network_entity_id = oci_core_internet_gateway.la_vitrina_internet_gateway.id
  }
}

# data "oci_core_images" "ubuntu_image" {
#   compartment_id = var.tenancy_ocid
#   operating_system = "Canonical Ubuntu"
#   operating_system_version = "22.04"
#   shape = "VM.Standard.E2.1.Micro"
# }

resource "oci_core_security_list" "vitrina_sec_list" {
  compartment_id = var.tenancy_ocid
  vcn_id         = oci_core_virtual_network.vcn.id
  display_name   = "allow-all-http"

  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"

    tcp_options {
      min = 80
      max = 80
    }
  }

  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"

    tcp_options {
      min = 3000
      max = 3000
    }
  }

  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
  }

  ingress_security_rules {
  protocol = "6" # TCP
  source   = "0.0.0.0/0"

  tcp_options {
    min = 22
    max = 22
  }
}

  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }
}

