import random
from django.core.management.base import BaseCommand
from faker import Faker
from datetime import datetime, timedelta
from case.models import (
    Case,
    Patient,
)
from user.models import User


class Command(BaseCommand):
    help = "Seed random initial patient case data"

    def handle(self, *args, **kwargs):
        fake = Faker()

        interviewer = User.objects.get(id=1)

        barangays = [
            "Santa Cruz",
            "Aguinaldo",
            "Airport (Tabucan Airport)",
            "Alalasan Lapuz",
            "Arguelles",
            "Arsenal Aduana",
            "North Avanceña",
            "Bakhaw",
            "Balabago",
            "Balantang",
            "Baldoza",
            "Sinikway (Bangkerohan Lapuz)",
            "Bantud",
            "Banuyao",
            "Baybay Tanza",
            "Benedicto (Jaro)",
            "Bito-on",
            "Monica Blumentritt",
            "Bolilao",
            "Bonifacio Tanza",
            "Bonifacio (Arevalo)",
            "Buhang",
            "Buhang Taft North",
            "Buntatala",
            "Seminario (Burgos Jalandoni)",
            "Caingin",
            "Calahunan",
            "Calaparan",
            "Calumpang",
            "Camalig",
            "El 98 Castilla (Claudio Lopez)",
            "Cochero",
            "Compania",
            "Concepcion-Montes",
            "Cuartero",
            "Cubay",
            "Danao",
            "Mabolo-delgado",
            "Democracia",
            "Desamparados",
            "Divinagracia",
            "Don Esteban-Lapuz",
            "Dulonan",
            "Dungon",
            "Dungon A",
            "Dungon B",
            "East Baluarte",
            "East Timawa",
            "Edganzon",
            "Tanza-Esperanza",
            "Fajardo",
            "Flores",
            "South Fundidor",
            "General Hughes-Montes",
            "Gloria",
            "Gustilo",
            "Guzman-Jesena",
            "Habog-habog Salvacion",
            "Hibao-an Sur",
            "Hinactacan",
            "Hipodromo",
            "Inday",
            "Infante",
            "Ingore",
            "Jalandoni Estate-Lapuz",
            "Jalandoni-Wilson",
            "Delgado-Jalandoni-Bagumbayan",
            "Javellana",
            "Jereos",
            "Calubihan",
            "Kasingkasing",
            "Katilingban",
            "Kauswagan",
            "Our Lady of Fatima",
            "Laguda",
            "Lanit",
            "Lapuz Norte",
            "Lapuz Sur",
            "Legaspi dela Rama",
            "Liberation",
            "Libertad, Santa Isabel",
            "Libertad-Lapuz",
            "Lopez Jaena (Jaro)",
            "Loboc-Lapuz",
            "Lopez Jaena Norte",
            "Lopez Jaena Sur",
            "Luna (Jaro)",
            "M. V. Hechanova",
            "Burgos-Mabini-Plaza",
            "Macarthur",
            "Magdalo",
            "Magsaysay",
            "Magsaysay Village",
            "Malipayon-delgado",
            "Mansaya-Lapuz",
            "Marcelo H. del Pilar",
            "Maria Clara",
            "Maria Cristina",
            "Mohon",
            "Molo Boulevard",
            "Montinola",
            "Muelle Loney-Montes",
            "Nabitasan",
            "Navais",
            "Nonoy",
            "North Fundidor",
            "North Baluarte",
            "North San Jose",
            "Oñate de Leon",
            "Obrero-Lapuz",
            "Ortiz",
            "Osmeña",
            "Our Lady of Lourdes",
            "Rizal Palapala I",
            "Rizal Palapala II",
            "PHHC Block 17",
            "PHHC Block 22 NHA",
            "Poblacion Molo",
            "President Roxas",
            "Progreso-Lapuz",
            "Punong-Lapuz",
            "Quezon",
            "Quintin Salas",
            "Rima-Rizal",
            "Rizal Estanzuela",
            "Rizal Ibarra",
            "Railway",
            "Roxas Village",
            "Sambag",
            "Sampaguita",
            "San Agustin",
            "San Antonio",
            "San Felix",
            "San Isidro (Jaro)",
            "Hibao-an Norte",
            "San Jose (Jaro)",
            "San Jose (Arevalo)",
            "San Juan",
            "San Nicolas",
            "San Pedro (Molo)",
            "San Pedro (Jaro)",
            "San Rafael",
            "San Roque",
            "San Vicente",
            "Santa Filomena",
            "Santa Rosa",
            "Santo Domingo",
            "Santo Niño Norte",
            "Santo Niño Sur",
            "Santo Rosario-Duran",
            "Simon Ledesma",
            "So-oc",
            "South Baluarte",
            "South San Jose",
            "Taal",
            "Tabuc Suba (Jaro)",
            "Tabucan",
            "Tacas",
            "Abeto Mirasol Taft South (Quirino Abeto)",
            "Tagbac",
            "Tap-oc",
            "Taytay Zone II",
            "Ticud (La Paz)",
            "Timawa Tanza I",
            "Timawa Tanza II",
            "Ungka",
            "Veterans Village",
            "Villa Anita",
            "West Habog-habog",
            "West Timawa",
            "Yulo-Arroyo",
            "Yulo Drive",
            "Zamora-Melliza",
            "Pale Benedicto Rizal (Mandurriao)",
            "Kahirupan",
            "Luna (La Paz)",
            "San Isidro (La Paz)",
            "San Jose (City Proper)",
            "Tabuc Suba (La Paz)",
            "Rizal (La Paz)",
        ]

        DENGUE_CASES = [
            (2016, 1860),
            (2017, 374),
            (2018, 880),
            (2019, 3402),
            (2020, 267),
            (2021, 276),
            (2022, 1105),
            (2023, 1316),
            (2024, 1577),
        ]

        for case in DENGUE_CASES:
            consult_year = case[0]
            case_count = case[1]
            for _ in range(case_count):
                first_name = fake.first_name()
                last_name = fake.last_name()
                middle_name = fake.first_name()
                date_of_birth = fake.date_of_birth(minimum_age=1, maximum_age=100)
                sex = random.choice(["M", "F"])
                ca_barangay = random.choice(barangays)
                p_barangay = random.choice(barangays)

                patient = Patient.objects.create(
                    first_name=first_name,
                    last_name=last_name,
                    middle_name=middle_name,
                    date_of_birth=date_of_birth,
                    sex=sex,
                    ca_house_no=fake.building_number(),
                    ca_street=fake.street_name(),
                    ca_barangay=ca_barangay,
                    ca_city="Iloilo City",
                    ca_province="Iloilo",
                    p_house_no=fake.building_number(),
                    p_street=fake.street_name(),
                    p_barangay=p_barangay,
                    p_city="Iloilo City",
                    p_province="Iloilo",
                    civil_status=random.choice(["S", "M", "W", "SEP"]),
                    date_first_vax=fake.date_this_decade(),
                    date_last_vax=fake.date_this_decade(),
                )

                start_con_date = datetime(consult_year, 1, 1)
                end_con_date = datetime(consult_year, 12, 31)
                date_con = fake.date_time_between_dates(start_con_date, end_con_date)
                is_admt = random.choice([True, False])
                date_onset = date_con - timedelta(days=random.randint(1, 20))
                clncl_class = random.choice(["N", "W", "S"])
                ns1_result = random.choice(["P", "N", "E", "PR"])
                date_ns1 = (
                    None
                    if ns1_result == "PR"
                    else date_onset + timedelta(days=random.randint(1, 5))
                )
                igg_elisa = random.choice(["P", "N", "E", "PR"])
                date_igg_elisa = (
                    None
                    if igg_elisa == "PR"
                    else date_onset + timedelta(days=random.randint(1, 10))
                )
                igm_elisa = random.choice(["P", "N", "E", "PR"])
                date_igm_elisa = (
                    None
                    if igm_elisa == "PR"
                    else date_onset + timedelta(days=random.randint(1, 10))
                )
                pcr = random.choice(["P", "N", "E", "PR"])
                date_pcr = (
                    None
                    if pcr == "PR"
                    else date_onset + timedelta(days=random.randint(1, 10))
                )
                case_class = random.choice(["S", "P", "C"])
                outcome = random.choice(["A", "D"])
                date_death = (
                    None
                    if outcome == "A"
                    else date_onset + timedelta(days=random.randint(5, 15))
                )

                Case.objects.create(
                    date_con=date_con,
                    is_admt=is_admt,
                    date_onset=date_onset,
                    clncl_class=clncl_class,
                    ns1_result=ns1_result,
                    date_ns1=date_ns1,
                    igg_elisa=igg_elisa,
                    date_igg_elisa=date_igg_elisa,
                    igm_elisa=igm_elisa,
                    date_igm_elisa=date_igm_elisa,
                    pcr=pcr,
                    date_pcr=date_pcr,
                    case_class=case_class,
                    outcome=outcome,
                    date_death=date_death,
                    interviewer=interviewer,
                    patient=patient,
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully seeded the database with {case_count} fake patient cases."
                )
            )
