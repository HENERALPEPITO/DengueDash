export const OPTIONS = {
  sex: [
    {
      value: "F",
      label: "Female",
    },
    {
      value: "M",
      label: "Male",
    },
  ],
  boolean: [
    {
      value: true,
      label: "Yes",
    },
    {
      value: false,
      label: "No",
    },
  ],
  civilStatus: [
    {
      value: "S",
      label: "Single",
    },
    {
      value: "M",
      label: "Married",
    },
    {
      value: "SEP",
      label: "Separated",
    },
    {
      value: "W",
      label: "Widowed",
    },
  ],
  clinicalClass: [
    {
      value: "N",
      label: "No warning signs",
    },
    {
      value: "W",
      label: "With warning signs",
    },
    {
      value: "S",
      label: "Severe Dengue",
    },
  ],
  labResult: [
    {
      value: "PR",
      label: "Pending Result",
    },
    {
      value: "P",
      label: "Positive",
    },
    {
      value: "N",
      label: "Negative",
    },
    {
      value: "E",
      label: "Equivocal",
    },
  ],
  caseClass: [
    {
      value: "C",
      label: "Confirmed",
    },
    {
      value: "P",
      label: "Probable",
    },
    {
      value: "S",
      label: "Suspect",
    },
  ],
  outcome: [
    {
      value: "A",
      label: "Alive",
    },
    {
      value: "D",
      label: "Dead",
    },
  ],
};

export const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    subunits: [
      {
        name: "Personal Detail",
        fields: [
          {
            inputType: "text",
            varName: "first_name",
            fieldLabel: "First Name",
          },
          {
            inputType: "text",
            varName: "middle_name",
            fieldLabel: "Middle Name",
          },
          {
            inputType: "text",
            varName: "last_name",
            fieldLabel: "Last Name",
          },
          {
            inputType: "text",
            varName: "suffix",
            fieldLabel: "Suffix",
          },
          {
            inputType: "select",
            varName: "sex",
            fieldLabel: "Sex",
            selectOptions: OPTIONS.sex,
          },
          {
            inputType: "select",
            varName: "civil_status",
            fieldLabel: "Civil Status",
            selectOptions: OPTIONS.civilStatus,
          },
          {
            inputType: "date",
            varName: "date_of_birth",
            fieldLabel: "Date of Birth",
          },
        ],
      },
      {
        name: "Address",
        fields: [
          {
            inputType: "number",
            varName: "addr_house_no",
            fieldLabel: "House No.",
          },
          {
            inputType: "text",
            varName: "addr_street",
            fieldLabel: "Street",
          },
          {
            inputType: "text",
            varName: "addr_barangay",
            fieldLabel: "Barangay",
          },
          {
            inputType: "text",
            varName: "addr_city",
            fieldLabel: "City",
          },
          {
            inputType: "text",
            varName: "addr_province",
            fieldLabel: "Province",
          },
        ],
      },
      {
        name: "Vaccination",
        fields: [
          {
            inputType: "date",
            varName: "date_first_vax",
            fieldLabel: "Date of First Vaccination",
          },
          {
            inputType: "date",
            varName: "date_last_vax",
            fieldLabel: "Date of Last Vaccination",
          },
        ],
      },
    ],
  },
  {
    id: "Step 2",
    name: "Clinical Status",
    subunits: [
      {
        name: "Consultation",
        fields: [
          {
            inputType: "date",
            varName: "date_con",
            fieldLabel: "Date Admitted/Consulted/Seen",
          },
          {
            inputType: "select",
            varName: "is_admt",
            fieldLabel: "Is Admitted?",
            selectOptions: OPTIONS.boolean,
          },
          {
            inputType: "date",
            varName: "date_onset",
            fieldLabel: "Date Onset of Illness",
          },
          {
            inputType: "select",
            varName: "clncl_class",
            fieldLabel: "Clinical Classification",
            selectOptions: OPTIONS.clinicalClass,
          },
        ],
      },
      {
        name: "Laboratory Results",
        fields: [
          {
            inputType: "select",
            varName: "ns1_result",
            fieldLabel: "NS1",
            selectOptions: OPTIONS.labResult,
          },
          {
            inputType: "date",
            varName: "date_ns1",
            fieldLabel: "Date done (NS1)",
          },
          {
            inputType: "select",
            varName: "igg_elisa",
            fieldLabel: "IgG ELISA",
            selectOptions: OPTIONS.labResult,
          },
          {
            inputType: "date",
            varName: "date_igg_elisa",
            fieldLabel: "Date done (IgG ELISA)",
          },
          {
            inputType: "select",
            varName: "igm_elisa",
            fieldLabel: "IgM ELISA",
            selectOptions: OPTIONS.labResult,
          },
          {
            inputType: "date",
            varName: "date_igm_elisa",
            fieldLabel: "Date done (IgM ELISA)",
          },
          {
            inputType: "select",
            varName: "pcr",
            fieldLabel: "PCR",
            selectOptions: OPTIONS.labResult,
          },
          {
            inputType: "date",
            varName: "date_pcr",
            fieldLabel: "Date done (PCR)",
          },
        ],
      },
      {
        name: "Outcome",
        fields: [
          {
            inputType: "select",
            varName: "case_class",
            fieldLabel: "Case Classification",
            selectOptions: OPTIONS.caseClass,
          },
          {
            inputType: "select",
            varName: "outcome",
            fieldLabel: "Outcome",
            selectOptions: OPTIONS.outcome,
          },
          {
            inputType: "date",
            varName: "date_death",
            fieldLabel: "Date of Death",
          },
        ],
      },
    ],
  },
];
