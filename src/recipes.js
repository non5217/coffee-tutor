export const recipes = {
  espresso: {
    name: 'เอสเพรสโซ่ (Espresso)',
    category: 'coffee',
    allowedTypes: ['hot', 'cold', 'blended'],
    specs: {
      hot: {
        ingredients: ['กาแฟบด 7-10 กรัม (1 ช็อต)', 'สกัดน้ำกาแฟ 1 oz (30 ml)'],
        layers: [{ name: 'Espresso', height: 100, color: '#451a03' }],
        steps: [{ name: 'สกัดเอสเพรสโซ่', duration: 25, phase: 'extraction', target: 'main', layerIndex: 0 }]
      },
      cold: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 4 oz (120 ml)', 'นมผสม 1.5 oz (45 ml)', 'น้ำแข็ง'],
        layers: [
          { name: 'นมผสม (Sweetened Milk Mix)', height: 35, color: '#fef3c7' },
          { name: 'เอสเพรสโซ่', height: 65, color: '#451a03' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'เทนมผสมลงในแก้วน้ำแข็ง', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'ราดช็อตเอสเพรสโซ่ลงแก้ว', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 }
        ]
      },
      blended: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 4 oz (120 ml)', 'นมผสม 2.5 oz (75 ml)', 'ผงปั่น 1 ช้อนโต๊ะ', 'น้ำแข็ง 1 แก้วพูน'],
        layers: [{ name: 'เอสเพรสโซ่ปั่น', height: 100, color: '#78350f' }],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'ปั่นส่วนผสมทั้งหมดให้ละเอียด', duration: 15, phase: 'blend', target: 'main', layerIndex: 0 }
        ]
      }
    }
  },
  americano: {
    name: 'อเมริกาโน่ (Americano)',
    category: 'coffee',
    allowedTypes: ['hot', 'cold'],
    specs: {
      hot: {
        ingredients: ['กาแฟบด 7-10 กรัม (1 ช็อต)', 'น้ำร้อน 3-4 oz', 'สกัดน้ำกาแฟ 1 oz (30 ml)'],
        layers: [
          { name: 'น้ำร้อน', height: 80, color: '#e0f2fe' },
          { name: 'เอสเพรสโซ่', height: 20, color: '#451a03' }
        ],
        steps: [
          { name: 'ใส่น้ำร้อนลงในแก้ว', duration: 5, phase: 'prep', target: 'main', layerIndex: 0 },
          { name: 'สกัดเอสเพรสโซ่ท็อปด้านบน', duration: 25, phase: 'extraction', target: 'main', layerIndex: 1 }
        ]
      },
      cold: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 2 oz (60 ml)', 'น้ำเปล่าเย็น 2-3 oz', 'น้ำเชื่อม 1 oz (30 ml)', 'น้ำแข็ง'],
        layers: [
          { name: 'น้ำเชื่อม + น้ำเปล่า', height: 60, color: '#e0f2fe' },
          { name: 'เอสเพรสโซ่', height: 40, color: '#451a03' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'เทน้ำเปล่าเย็นและน้ำเชื่อมลงแก้วน้ำแข็ง', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'ราดช็อตเอสเพรสโซ่ท็อปด้านบน', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 }
        ]
      }
    }
  },
  cappuccino: {
    name: 'คาปูชิโน่ (Cappuccino)',
    category: 'coffee',
    allowedTypes: ['hot', 'cold', 'blended'],
    specs: {
      hot: {
        ingredients: ['กาแฟบด 7-10 กรัม (1 ช็อต)', 'นมร้อนครึ่งแก้ว', 'ฟองนมครึ่งแก้ว', 'ผงโกโก้ตกแต่ง'],
        layers: [
          { name: 'เอสเพรสโซ่', height: 30, color: '#451a03' },
          { name: 'นมร้อน', height: 35, color: '#fef3c7' },
          { name: 'ฟองนม', height: 35, color: '#ffffff' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 1 ช็อต', duration: 25, phase: 'extraction', target: 'main', layerIndex: 0 },
          { name: 'เทนมร้อนครึ่งแก้ว', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 },
          { name: 'ตักฟองนมท็อปด้านบน', duration: 5, phase: 'garnish', target: 'main', layerIndex: 2 }
        ]
      },
      cold: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 3 oz (90 ml)', 'นมผสม 1.5 oz (45 ml)', 'น้ำแข็ง', 'ฟองนมแช่เย็น'],
        layers: [
          { name: 'นมผสม', height: 30, color: '#fef3c7' },
          { name: 'เอสเพรสโซ่', height: 40, color: '#451a03' },
          { name: 'ฟองนมเย็น', height: 30, color: '#ffffff' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'เทนมผสมลงแก้วน้ำแข็ง', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'ราดช็อตเอสเพรสโซ่ลงแก้ว', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 },
          { name: 'ท็อปด้วยฟองนมเย็น', duration: 5, phase: 'garnish', target: 'main', layerIndex: 2 }
        ]
      },
      blended: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 3 oz (90 ml)', 'นมผสม 2.5 oz (75 ml)', 'นมสด 1 oz (30 ml)', 'ผงปั่น 1 ช้อนโต๊ะ', 'น้ำแข็ง 1 แก้วพูน'],
        layers: [{ name: 'คาปูชิโน่ปั่น', height: 100, color: '#78350f' }],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'ปั่นกาแฟกับนมและผงปั่นให้ละเอียด', duration: 15, phase: 'blend', target: 'main', layerIndex: 0 }
        ]
      }
    }
  },
  latte: {
    name: 'ลาเต้ (Latte)',
    category: 'coffee',
    allowedTypes: ['hot', 'cold', 'blended'],
    specs: {
      hot: {
        ingredients: ['กาแฟบด 7-10 กรัม (1 ช็อต)', 'นมสดเกือบเต็มแก้ว', 'ฟองนมบางเบา'],
        layers: [
          { name: 'เอสเพรสโซ่', height: 30, color: '#451a03' },
          { name: 'นมร้อน', height: 60, color: '#fef3c7' },
          { name: 'ฟองนมบางเบา', height: 10, color: '#ffffff' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 1 ช็อต', duration: 25, phase: 'extraction', target: 'main', layerIndex: 0 },
          { name: 'เทนมสตีมเกือบเต็มแก้ว', duration: 10, phase: 'garnish', target: 'main', layerIndex: 1 },
          { name: 'ตักฟองนมท็อปด้านบน', duration: 3, phase: 'garnish', target: 'main', layerIndex: 2 }
        ]
      },
      cold: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 2 oz (60 ml)', 'นมสด 2.5-4 oz', 'นมผสม 1.5 oz (สูตรหวาน)', 'น้ำแข็ง'],
        layers: [
          { name: 'นมสด / นมผสม', height: 70, color: '#fffdf5' },
          { name: 'เอสเพรสโซ่', height: 30, color: '#451a03' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'ผสมนมสดกับนมผสม เทลงแก้ว', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'ราดช็อตเอสเพรสโซ่ท็อปด้านบน', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 }
        ]
      },
      blended: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 2 oz (60 ml)', 'นมผสม 2.5 oz (75 ml)', 'นมสด 2.5-3 oz', 'ผงปั่น 1 ช้อนโต๊ะ', 'น้ำแข็ง 1 แก้วพูน'],
        layers: [{ name: 'ลาเต้ปั่นหวานมัน', height: 100, color: '#854d0e' }],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'ปั่นส่วนผสมทั้งหมดให้เนียนละเอียด', duration: 15, phase: 'blend', target: 'main', layerIndex: 0 }
        ]
      }
    }
  },
  mocha: {
    name: 'มอคค่า (Mocha)',
    category: 'coffee',
    allowedTypes: ['hot', 'cold', 'blended'],
    specs: {
      hot: {
        ingredients: ['กาแฟบด 7-10 กรัม (1 ช็อต)', 'โกโก้ผสม 1 oz (30 ml)', 'นมสดร้อน 2-3 oz', 'ผงโกโก้โรยหน้า'],
        layers: [
          { name: 'โกโก้ผสม', height: 30, color: '#3b2314' },
          { name: 'เอสเพรสโซ่', height: 20, color: '#451a03' },
          { name: 'นมสดร้อน', height: 50, color: '#fef3c7' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 1 ช็อต', duration: 25, phase: 'extraction', target: 'main', layerIndex: 1 },
          { name: 'ผสมโกโก้กับนมร้อน', duration: 10, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'เทนมสดร้อนท็อปหน้า', duration: 5, phase: 'garnish', target: 'main', layerIndex: 2 }
        ]
      },
      cold: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 3 oz (90 ml)', 'โกโก้ผสม 1.5 oz (45 ml)', 'นมผสม 0.5 oz (15 ml)', 'น้ำแข็ง'],
        layers: [
          { name: 'โกโก้ผสม', height: 40, color: '#3b2314' },
          { name: 'นมผสม', height: 20, color: '#fef3c7' },
          { name: 'เอสเพรสโซ่', height: 40, color: '#451a03' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'เทโกโก้ผสมลงแก้วน้ำแข็ง', duration: 4, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'เติมนมผสมให้เกิดชั้นกลาง', duration: 3, phase: 'mix', target: 'main', layerIndex: 1 },
          { name: 'ราดช็อตเอสเพรสโซ่ท็อปด้านบน', duration: 5, phase: 'mix', target: 'main', layerIndex: 2 }
        ]
      },
      blended: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 3 oz (90 ml)', 'โกโก้ผสม 1.5 oz (45 ml)', 'นมผสม 1.5 oz (45 ml)', 'ผงปั่น 1 ช้อนโต๊ะ', 'น้ำแข็ง 1 แก้วพูน'],
        layers: [{ name: 'มอคค่าปั่น', height: 100, color: '#5c3a21' }],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'ปั่นโกโก้ นมผสม กาแฟ และผงปั่นเข้าด้วยกัน', duration: 15, phase: 'blend', target: 'main', layerIndex: 0 }
        ]
      }
    }
  },
  caramel_macchiato: {
    name: 'คาราเมลมัคคิอาโต้ (Caramel Macchiato)',
    category: 'coffee',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 2 oz (60 ml)', 'นมสด 4 oz (120 ml)', 'ไซรัปคาราเมล 2 ปั๊ม (15 ml)', 'ซอสคาราเมลสำหรับตกแต่ง', 'น้ำแข็ง'],
        layers: [
          { name: 'คาราเมลไซรัป', height: 15, color: '#f59e0b' },
          { name: 'นมสด', height: 45, color: '#fffdf5' },
          { name: 'เอสเพรสโซ่', height: 30, color: '#451a03' },
          { name: 'ฟองนม + ซอสคาราเมล', height: 10, color: '#d97706' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'เทไซรัปคาราเมลลงก้นแก้ว', duration: 3, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'เติมนมสดและน้ำแข็งให้ได้ชั้นกลาง', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 },
          { name: 'ราดช็อตเอสเพรสโซ่ท็อปด้านบน', duration: 4, phase: 'mix', target: 'main', layerIndex: 2 },
          { name: 'ปิดท้ายด้วยฟองนมและซอสคาราเมล', duration: 3, phase: 'garnish', target: 'main', layerIndex: 3 }
        ]
      }
    }
  },
  dalgona: {
    name: 'ดัลโกนาสด (Dalgona Coffee)',
    category: 'coffee',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 2 oz (60 ml)', 'น้ำตาลทราย 2 oz (60 ml)', 'นมสด 3/4 แก้ว', 'น้ำแข็ง'],
        layers: [
          { name: 'นมสด', height: 60, color: '#fffdf5' },
          { name: 'โฟมดัลโกนาเข้มข้น', height: 40, color: '#b45309' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'เทนมสดลงในแก้วน้ำแข็ง', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'ตีช็อตกาแฟกับน้ำตาลและราดโฟมท็อปด้านบน', duration: 10, phase: 'mix', target: 'main', layerIndex: 1 }
        ]
      }
    }
  },
  orange_black: {
    name: 'กาแฟน้ำส้มสด (Orange Black Coffee)',
    category: 'coffee',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['กาแฟบด 14-20 กรัม (2 ช็อต)', 'สกัดน้ำกาแฟ 2 oz (60 ml)', 'น้ำส้มคั้นสด 4 oz (120 ml)', 'น้ำแข็ง'],
        layers: [
          { name: 'น้ำส้มคั้นสด', height: 65, color: '#f97316' },
          { name: 'เอสเพรสโซ่ช็อต', height: 35, color: '#451a03' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 2 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'เทน้ำส้มคั้นลงในแก้วน้ำแข็ง', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'ราดช็อตเอสเพรสโซ่ท็อปด้านบน', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 }
        ]
      }
    }
  },
  mojito_coffee: {
    name: 'โมจิโต้คอฟฟี่ (Mojito Coffee)',
    category: 'coffee',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['กาแฟบด 7-10 กรัม (1 ช็อต)', 'สกัดน้ำกาแฟ 1 oz (30 ml)', 'ไซรัปมิ้นต์ 0.5 oz (15 ml)', 'น้ำมะนาวคั้นสด 7.5 ml', 'น้ำเชื่อม 0.5 oz (15 ml)', 'โซดา 5 oz (150 ml)', 'ใบมิ้นต์ตกแต่ง', 'น้ำแข็ง'],
        layers: [
          { name: 'ไซรัปมิ้นต์ + มะนาว', height: 20, color: '#10b981' },
          { name: 'โซดาซ่า', height: 60, color: '#e0f2fe' },
          { name: 'เอสเพรสโซ่', height: 20, color: '#451a03' }
        ],
        steps: [
          { name: 'สกัดเอสเพรสโซ่ 1 ช็อต', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'ผสมไซรัปมิ้นต์ มะนาว และน้ำเชื่อมลงก้นแก้ว', duration: 4, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'เติมโซดาซ่าให้ได้ชั้นกลางใส', duration: 4, phase: 'mix', target: 'main', layerIndex: 1 },
          { name: 'เทช็อตกาแฟลงแก้วและตกแต่งใบมิ้นต์', duration: 5, phase: 'garnish', target: 'main', layerIndex: 2 }
        ]
      }
    }
  },
  thai_tea: {
    name: 'ชาไทยเย็น (Thai Tea)',
    category: 'tea',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['ผงชาไทย 1 ช้อนตวง', 'น้ำร้อน 5 oz (แช่ชา 2 นาที)', 'นมผสม 1.5 oz (45 ml)', 'นมสดสำหรับท็อปหน้า', 'น้ำแข็ง'],
        layers: [
          { name: 'ชาไทยเข้มข้น', height: 75, color: '#ea580c' },
          { name: 'นมสดราดหน้า', height: 25, color: '#ffffff' }
        ],
        steps: [
          { name: 'แช่ผงชาในน้ำร้อน 2 นาทีและผสมนมผสม', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'เทชาไทยลงแก้วน้ำแข็ง', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'ราดนมสดท็อปด้านบนแก้ว', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 }
        ]
      }
    }
  },
  matcha_latte: {
    name: 'มัทฉะเย็น (Matcha Latte)',
    category: 'tea',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['ผงมัทฉะ 100% 1 ช้อนโต๊ะ', 'น้ำร้อน 2 oz (60 ml)', 'นมผสม 1.5 oz (45 ml)', 'นมสดจืด 2 oz (60 ml)', 'น้ำแข็ง'],
        layers: [
          { name: 'นมสดผสมนมผสม', height: 60, color: '#fef3c7' },
          { name: 'มัทฉะเข้มข้น', height: 40, color: '#15803d' }
        ],
        steps: [
          { name: 'ละลายผงมัทฉะกับน้ำร้อน', duration: 15, phase: 'extraction', target: 'shot_cup' },
          { name: 'เทนมสดผสมนมผสมลงในแก้ว', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'ราดมัทฉะเข้มข้นท็อปหน้า', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 }
        ]
      }
    }
  },
  lemon_tea: {
    name: 'ชามะนาว (Lemon Tea)',
    category: 'tea',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['ผงชาไทย 1 ช้อนตวง', 'น้ำร้อน 5 oz (กรองเอาน้ำชา 4 oz)', 'น้ำมะนาวสด 0.5 oz (15 ml)', 'ไซรัปน้ำเชื่อม 1 oz (30 ml)', 'น้ำเปล่า 0.5 oz (15 ml)', 'น้ำแข็ง'],
        layers: [{ name: 'ชามะนาว', height: 100, color: '#d97706' }],
        steps: [
          { name: 'ชงชาแช่น้ำร้อนแล้วกรองกากชาออก', duration: 25, phase: 'extraction', target: 'shot_cup' },
          { name: 'ผสมน้ำชากับน้ำเชื่อมและน้ำมะนาว เทลงแก้ว', duration: 10, phase: 'mix', target: 'main', layerIndex: 0 }
        ]
      }
    }
  },
  thai_matcha: {
    name: 'ชาไทยมัทฉะเย็น (Thai Tea Matcha)',
    category: 'tea',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['น้ำชาไทย 2 oz (60 ml)', 'ผงมัทฉะ 100% 1 ช้อนชาพูน (3g)', 'น้ำร้อน 2 oz (60 ml)', 'นมผสม 1.5 oz (45 ml)', 'นมสดจืด 1-2 oz (30-60 ml)', 'น้ำแข็ง'],
        layers: [
          { name: 'ชาไทยส้ม', height: 40, color: '#ea580c' },
          { name: 'นมสดขาว', height: 30, color: '#ffffff' },
          { name: 'ชาเขียวมัทฉะ', height: 30, color: '#15803d' }
        ],
        steps: [
          { name: 'ผสมผงมัทฉะกับน้ำร้อน 2 oz และนมผสม', duration: 15, phase: 'prep', target: 'shot_cup' },
          { name: 'เทชาเขียวมัทฉะลงแก้วน้ำแข็ง', duration: 5, phase: 'mix', target: 'main', layerIndex: 2 },
          { name: 'เติมนมสดจืดตรงกลาง', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 },
          { name: 'เทชาไทยส้มแยกชั้นด้านล่างสุด', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 }
        ]
      }
    }
  },
  cocoa: {
    name: 'โกโก้เย็น (Cocoa)',
    category: 'non-coffee',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['ผงโกโก้พูน 1 ช้อนโต๊ะ', 'น้ำร้อน 4 oz (120 ml)', 'นมผสม 2 oz (60 ml)', 'น้ำแข็ง'],
        layers: [
          { name: 'นมผสมเข้มข้น', height: 30, color: '#fef3c7' },
          { name: 'โกโก้เข้มช็อคโกแลต', height: 70, color: '#3b2314' }
        ],
        steps: [
          { name: 'ละลายผงโกโก้ในน้ำร้อนจัด', duration: 15, phase: 'extraction', target: 'shot_cup' },
          { name: 'เทนมผสมลงแก้วน้ำแข็ง', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'ราดโกโก้เข้มข้นลงด้านบน', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 }
        ]
      }
    }
  },
  cocoa_mint: {
    name: 'โกโก้มิ้นท์ (Cocoa Mint)',
    category: 'non-coffee',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['ผงโกโก้พูน 1 ช้อนโต๊ะ', 'น้ำร้อน 4 oz (120 ml)', 'นมผสม 1 oz (30 ml)', 'ไซรัปมิ้นท์ 0.5 oz (15 ml)', 'ฟองนมตกแต่ง', 'น้ำแข็ง'],
        layers: [
          { name: 'ไซรัปมิ้นท์เขียวสด', height: 20, color: '#10b981' },
          { name: 'นมสดผสมนมผสม', height: 30, color: '#fef3c7' },
          { name: 'โกโก้เข้มข้น', height: 50, color: '#3b2314' }
        ],
        steps: [
          { name: 'ละลายผงโกโก้ในน้ำร้อนและนมผสม', duration: 15, phase: 'prep', target: 'shot_cup' },
          { name: 'เทไซรัปมิ้นต์ลงแก้วน้ำแข็ง', duration: 3, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'เติมนมสดผสมนมผสมให้เกิดชั้นกลาง', duration: 4, phase: 'mix', target: 'main', layerIndex: 1 },
          { name: 'เทโกโก้แยกชั้นสวยงามท็อปหน้า', duration: 5, phase: 'mix', target: 'main', layerIndex: 2 }
        ]
      }
    }
  },
  caramel_milk: {
    name: 'นมสดคาราเมล (Caramel Milk)',
    category: 'non-coffee',
    allowedTypes: ['cold'],
    specs: {
      cold: {
        ingredients: ['นมสดรสจืด 6 oz (180 ml)', 'ไซรัปคาราเมล 0.5 oz (15 ml)', 'นมผสม 0.5 oz (15 ml)', 'ซอสคาราเมลบีบตกแต่ง', 'น้ำแข็ง'],
        layers: [
          { name: 'นมผสมหวานมัน', height: 20, color: '#fef3c7' },
          { name: 'นมสดสไตล์นัว', height: 60, color: '#fffdf5' },
          { name: 'ซอสคาราเมล + ฟองนม', height: 20, color: '#f59e0b' }
        ],
        steps: [
          { name: 'เทไซรัปคาราเมลลงก้นแก้ว', duration: 5, phase: 'mix', target: 'main', layerIndex: 0 },
          { name: 'ใส่นมผสมและนมสดคนให้เข้ากัน', duration: 5, phase: 'mix', target: 'main', layerIndex: 1 },
          { name: 'บีบซอสคาราเมลตกแต่งท็อปด้านบน', duration: 5, phase: 'garnish', target: 'main', layerIndex: 2 }
        ]
      }
    }
  }
}
