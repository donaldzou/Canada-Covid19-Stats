var code = ["ON","BC","QC","AB","SK","MB","NB","PE","NL","RP","NS","NT","YT"]







var simplemaps_canadamap_mapdata={
  main_settings: {
   //General settings
    width: "500", //'700' or 'responsive'

    background_color: "#FFFFFF",
    background_transparent: "yes",
    border_color: "#ffffff",
    popups: "detect",
    
    //State defaults
    state_description: "State description",
    state_color: "#88A4BC",
    // state_hover_color: "#3B729F",
    state_url: "#",
    border_size: 1.5,
    all_states_inactive: "no",
    all_states_zoomable: "no",
    
    //Location defaults
    location_description: "Location description",
    location_color: "#FF0067",
    location_opacity: 0.8,
    location_hover_opacity: 1,
    location_url: "",
    location_size: 25,
    location_type: "square",
    location_image_source: "frog.png",
    location_border_color: "#FFFFFF",
    location_border: 2,
    location_hover_border: 2.5,
    all_locations_inactive: "no",
    all_locations_hidden: "no",
    
    //Label defaults
    label_color: "#ffffff",
    label_hover_color: "#ffffff",
    label_size: 22,
    label_font: "Arial",
    hide_labels: "no",
   
    //Zoom settings
    zoom: "yes",
    back_image: "no",
    arrow_color: "#3B729F",
    arrow_color_border: "#88A4BC",
    initial_back: "no",
    initial_zoom: -1,
    initial_zoom_solo: "no",
    region_opacity: 1,
    region_hover_opacity: 0.6,
    zoom_out_incrementally: "yes",
    zoom_percentage: 0.99,
    zoom_time: 0.5,
    
    //Popup settings
    popup_color: "white",
    popup_opacity: 1,
    popup_shadow: 1,
    popup_corners: 5,
    popup_font: '14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    popup_nocss: "no",
    
    //Advanced settings
    div: "map",
    auto_load: "yes",
    url_new_tab: "no",
    images_directory: "default",
    fade_time: 0.1,
    import_labels: "no",
    // link_text: "View Website",
    state_image_url: "",
    state_image_position: "",
    location_image_url: ""
  },
  state_specific: {
    AB: {
      color: "#d80000",
      name: "Alberta",
      description: "N/A cases",
    },
    BC: {
      color: "#d80000",
      name: "British Columbia",
      description: "N/A cases" 
    },
    SK: {
      color: "#ffa5a5",
      name: "Saskatchewan",
      description: "N/A cases" 
    },
    MB: {
      color: "#ffa5a5",
      name: "Manitoba",
      description: "N/A cases" 
    },
    ON: {
      color: "#ff7272",
      name: "Ontario",
      description: "N/A cases" 
    },
    QC: {
      color: "#ff3f3f",
      name: "Quebec",
      description: "N/A cases" 
    },
    NB: {
      color: "#ff3f3f",
      name: "New Brunswick",
      description: "N/A cases" 
    },
    PE: {
      color: "#ff7272",
      name: "Prince Edward Island",
      description: "N/A cases" 
    },
    NS: {
      color: "#ff3f3f",
      name: "Nova Scotia",
      description: "N/A cases" 
    },
    NL: {
      color: "#ff0c0c",
      name: "Newfoundland",
      description: "N/A cases" 
    },
    NU: {
      color: "#ffa5a5",
      name: "Nunavut",
      description: "N/A cases",
      hover_color: "#B90000"
    },
    NT: {
      color: "#ff0c0c",
      name: "Northwest Territories",
      description: "N/A cases"
      
    },
    YT: {
      color: "#d80000",
      name: "Yukon",
      description: "N/A cases" 
    }
  },
  locations: {},
  labels: {
    PE: {
      x: 960,
      y: 814,
      parent_id: "PE",
      width: 65,
      display: "all",
      pill: "yes"
    },
    NS: {
      x: 960,
      y: 854,
      parent_id: "NS",
      width: 65,
      display: "all",
      pill: "yes"
    },
    AB: {
      x: 232,
      y: 657,
      parent_id: "AB"
    },
    BC: {
      x: 117,
      y: 635,
      parent_id: "BC"
    },
    YT: {
      x: 75,
      y: 440,
      parent_id: "YT"
    },
    NT: {
      x: 225,
      y: 471,
      parent_id: "NT"
    },
    NU: {
      x: 429,
      y: 478,
      parent_id: "NU"
    },
    SK: {
      x: 332,
      y: 670,
      parent_id: "SK"
    },
    MB: {
      x: 430,
      y: 675,
      parent_id: "MB"
    },
    NL: {
      x: 840,
      y: 643,
      parent_id: "NL"
    },
    NB: {
      x: 837,
      y: 798,
      parent_id: "NB"
    },
    ON: {
      x: 552,
      y: 747,
      parent_id: "ON"
    },
    QC: {
      x: 718,
      y: 704,
      parent_id: "QC"
    }
  },
  regions: {},
  data: {
    data: {
      AB: "100",
      BC: "90",
      SK: "4",
      MB: "5",
      ON: "12",
      QC: "14",
      NB: "16",
      PE: "1000000",
      NS: "20",
      NL: "30",
      NU: "4",
      NT: "50",
      YT: "70"
    }
  }
};