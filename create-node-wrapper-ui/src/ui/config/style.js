/* eslint-disable no-underscore-dangle */
import { defaultsDeep as _defaultsDeep } from 'lodash';

import coreConfig from './core';

const { theme } = coreConfig || {};

// default Material UI theme Object: https://material-ui.com/customization/default-theme/
const defaultStyles = {
  palette: {
    primary: {
      main        : '#2a73da',
      light       : '#6da1ff',
      dark        : '#3f51b5',
      contrastText: '#fff'
    }
    // secondary: {
    //   light       : '#ff7961',
    //   main        : '#d34242',
    //   dark        : '#ba000d',
    //   contrastText: '#000'
    // },
  },
  typography: {
    // Migration to typography v2
    useNextVariants: true,
    h1             : {
      fontWeight : 400,
      fontSize   : '32px',
      lineHeight : '1.35417em',
      paddingLeft: 0
    },
    h2: {
      fontSize  : '29px',
      fontWeight: 500
    },
    // sections header
    subtitle2: {
      padding   : '10px 15px',
      margin    : '20px 0',
      // border    : '1px solid #999',
      fontSize  : '24px',
      fontWeight: 400
    },
    h6: {
      fontSize  : '16px',
      fontWeight: 600
    }
  },
  // documentation: https://material-ui.com/customization/themes/#customizing-all-instances-of-a-component-type
  overrides: {
    MuiButton: {
      textPrimary: {
        fontWeight: 500
      },
      text: {
        color: 'white'
      },
      colorInherit: {
        fontWeight   : 500,
        fontSize     : '14px',
        textTransform: 'uppercase',
        minHeight    : 'inherit'
      },
      root: {
        borderRadius : 0,
        fontWeight   : 100,
        minHeight    : '33px',
        textTransform: 'capitalize',
        fontSize     : '22px',
        verticalAlign: 'bottom'
      },
      contained: {
        boxShadow    : 0,
        minHeight    : '33px',
        textTransform: 'capitalize',
        fontSize     : '22px',
        verticalAlign: 'bottom'
      }
    },
    MuiInputBase: {
      input: {
        height: '100%'
      }
    }
  }
};

const stage = {
  palette: {
    primary: {
      main        : '#222',
      light       : '#999',
      dark        : '#333',
      contrastText: '#fff'
    },
    secondary: {
      main: '#6f9e4c'
    }
  },
  typography: {
    // for Typography elements
    fontFamily: 'Montserrat, sans-serif',
    h1        : {
      textAlign : 'left',
      padding   : '15px 20px',
      fontWeight: 600
    },
    h2: {
      textAlign    : 'left',
      textTransform: 'uppercase',
      fontWeight   : 600,
      padding      : '20px 0',
      fontSize     : '24px'
    },
    body2: {
      fontSize  : '15px',
      lineHeight: 1.2
    }
  },
  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: '#8D43AF'
      }
    },
    MuiTablePagination: {
      toolbar: {
        backgroundColor: 'white!important'
      }
    },
    MuiButton: {
      root: {
        borderRadius: '5px'
      }
    },
    MuiPaper: {
      root: {
        // backgroundColor: 'transparent'
      }
    }
  }
};

const prod = {
  palette: {
    primary: {
      main        : '#222',
      light       : '#999',
      dark        : '#333',
      contrastText: '#fff'
    },
    secondary: {
      main: '#6f9e4c'
    }
  },
  typography: {
    // for Typography elements
    fontFamily: 'Montserrat, sans-serif',
    h1        : {
      textAlign : 'left',
      padding   : '15px 20px',
      fontWeight: 600
    },
    h2: {
      textAlign    : 'left',
      textTransform: 'uppercase',
      fontWeight   : 600,
      padding      : '20px 0',
      fontSize     : '24px'
    },
    body2: {
      fontSize  : '15px',
      lineHeight: 1.2
    }
  },
  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: '#222'
      }
    },
    MuiTablePagination: {
      toolbar: {
        backgroundColor: 'white!important'
      }
    },
    MuiButton: {
      root: {
        borderRadius: '5px'
      }
    },
    MuiPaper: {
      root: {
        // backgroundColor: 'transparent'
      }
    }
  }
};

const preprod = {
  palette: {
    primary: {
      main        : '#222',
      light       : '#999',
      dark        : '#333',
      contrastText: '#fff'
    },
    secondary: {
      main: '#6f9e4c'
    }
  },
  typography: {
    // for Typography elements
    fontFamily: 'Montserrat, sans-serif',
    h1        : {
      textAlign : 'left',
      padding   : '15px 20px',
      fontWeight: 600
    },
    h2: {
      textAlign    : 'left',
      textTransform: 'uppercase',
      fontWeight   : 600,
      padding      : '20px 0',
      fontSize     : '24px'
    },
    body2: {
      fontSize  : '15px',
      lineHeight: 1.2
    }
  },
  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: '#6A39C0'
      }
    },
    MuiTablePagination: {
      toolbar: {
        backgroundColor: 'white!important'
      }
    },
    MuiButton: {
      root: {
        borderRadius: '5px'
      }
    },
    MuiPaper: {
      root: {
        // backgroundColor: 'transparent'
      }
    }
  }
};

const lab = {
  palette: {
    primary: {
      main        : '#222',
      light       : '#999',
      dark        : '#333',
      contrastText: '#fff'
    },
    secondary: {
      main: '#6f9e4c'
    }
  },
  typography: {
    // for Typography elements
    fontFamily: 'Montserrat, sans-serif',
    h1        : {
      textAlign : 'left',
      padding   : '15px 20px',
      fontWeight: 600
    },
    h2: {
      textAlign    : 'left',
      textTransform: 'uppercase',
      fontWeight   : 600,
      padding      : '20px 0',
      fontSize     : '24px'
    },
    body2: {
      fontSize  : '15px',
      lineHeight: 1.2
    }
  },
  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: '#2A73DA'
      }
    },
    MuiTablePagination: {
      toolbar: {
        backgroundColor: 'white!important'
      }
    },
    MuiButton: {
      root: {
        borderRadius: '5px'
      }
    },
    MuiPaper: {
      root: {
        // backgroundColor: 'transparent'
      }
    }
  }
};

const dev = {
  palette: {
    primary: {
      main        : '#222',
      light       : '#999',
      dark        : '#333',
      contrastText: '#fff'
    },
    secondary: {
      main: '#6f9e4c'
    }
  },
  typography: {
    // for Typography elements
    fontFamily: 'Montserrat, sans-serif',
    h1        : {
      textAlign : 'left',
      padding   : '15px 20px',
      fontWeight: 600
    },
    h2: {
      textAlign    : 'left',
      textTransform: 'uppercase',
      fontWeight   : 600,
      padding      : '20px 0',
      fontSize     : '24px'
    },
    body2: {
      fontSize  : '15px',
      lineHeight: 1.2
    }
  },
  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: '#5DBCD2'
      }
    },
    MuiTablePagination: {
      toolbar: {
        backgroundColor: 'white!important'
      }
    },
    MuiButton: {
      root: {
        borderRadius: '5px'
      }
    },
    MuiPaper: {
      root: {
        // backgroundColor: 'transparent'
      }
    }
  }
};

// for those places where we don't use theme.
if (!window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__) {
  window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
}

const customStyles = { stage, prod, preprod, dev, lab };

export default _defaultsDeep({}, customStyles[theme] || {}, defaultStyles);
