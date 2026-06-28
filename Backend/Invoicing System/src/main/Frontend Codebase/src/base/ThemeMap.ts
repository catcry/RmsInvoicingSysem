import {ColorTheme, CustomTheme, ThemeMode} from "./ThemeColorEnum";
import {createTheme, Theme} from "@mui/material/styles";
import {
    amber,
    blue,
    cyan,
    deepOrange,
    deepPurple,
    green,
    indigo,
    lightBlue,
    lightGreen,
    lime,
    orange,
    pink,
    red,
    teal,
    yellow
} from "@mui/material/colors";


export default class ThemeMap {
    key: CustomTheme;
    value: Theme;

    public static getTheme(color: ColorTheme, mode: ThemeMode) {
        const defaultTheme = () => createTheme({
            palette: {
                mode: ThemeMode.LIGHT,
                primary: {
                    // light:indigo["A100"],
                    // main: indigo["A200"],
                    // dark: indigo["A400"],
                    // contrastText: '#fff',
                    main: '#4588d6',
                    light: '#f4f7fb',
                    dark: '#0f4ca8',
                    contrastText: '#0f4ca8',
                },
                secondary: {
                    main: '#FF5733'
                }
            },
        });
        const theme = this.themes.find(theme => theme.key.color === color && theme.key.mode === mode)?.value;

        return theme || defaultTheme();
    }

    public static themes: ThemeMap[] = [
        new ThemeMap({color: ColorTheme.RED, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: red["A100"],
                        main: red["A200"],
                        dark: red["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.PINK, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: pink["A100"],
                        main: pink["A200"],
                        dark: pink["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.PURPLE, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        // light:purple["A100"],
                        // main: purple["A200"],
                        // dark: purple["A400"],
                        // contrastText: '#fff',
                        main: '#1e0530',
                        light: '#ece5f8',
                        contrastText: '#47008F',
                    },
                    secondary: {
                        light: deepOrange["A100"],
                        main: deepOrange["A200"],
                        dark: deepOrange["A400"],
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.DEEP_PURPLE, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: deepPurple["A100"],
                        main: deepPurple["A200"],
                        dark: deepPurple["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.INDIGO, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        // light:indigo["A100"],
                        // main: indigo["A200"],
                        // dark: indigo["A400"],
                        // contrastText: '#fff',
                        main: '#4588d6',
                        light: '#f4f7fb',
                        dark: '#0f4ca8',
                        contrastText: '#0f4ca8',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.BLUE, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: blue["A100"],
                        main: blue["A200"],
                        dark: blue["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.LIGHT_BLUE, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: lightBlue["A100"],
                        main: lightBlue["A200"],
                        dark: lightBlue["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.CYAN, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: cyan["A100"],
                        main: cyan["A200"],
                        dark: cyan["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.TEAL, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: teal["A100"],
                        main: teal["A200"],
                        dark: teal["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.GREEN, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: green["A100"],
                        main: green["A200"],
                        dark: green["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.LIGHT_GREEN, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: lightGreen["A100"],
                        main: lightGreen["A200"],
                        dark: lightGreen["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.LIME, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: lime["A100"],
                        main: lime["A200"],
                        dark: lime["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.YELLOW, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: yellow["A100"],
                        main: yellow["A200"],
                        dark: yellow["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.AMBER, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: amber["A100"],
                        main: amber["A200"],
                        dark: amber["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.ORANGE, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: orange["A100"],
                        main: orange["A200"],
                        dark: orange["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.DEEP_ORANGE, mode: ThemeMode.LIGHT}, createTheme({
                palette: {
                    mode: ThemeMode.LIGHT,
                    primary: {
                        light: deepOrange["A100"],
                        main: deepOrange["A200"],
                        dark: deepOrange["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.RED, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: red["A100"],
                        main: red["A200"],
                        dark: red["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.PINK, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: pink["A100"],
                        main: pink["A200"],
                        dark: pink["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.PURPLE, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        // light:purple["A100"],
                        // main: purple["A200"],
                        // dark: purple["A400"],
                        // contrastText: '#fff',
                        main: '#1e0530',
                        light: '#ece5f8',
                        contrastText: '#9c7ec5',
                    },
                    secondary: {
                        light: deepOrange["A100"],
                        main: deepOrange["A200"],
                        dark: deepOrange["A400"],
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.DEEP_PURPLE, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: deepPurple["A100"],
                        main: deepPurple["A200"],
                        dark: deepPurple["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.INDIGO, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: indigo["A100"],
                        main: indigo["A200"],
                        dark: indigo["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.BLUE, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: blue["A100"],
                        main: blue["A200"],
                        dark: blue["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.LIGHT_BLUE, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: lightBlue["A100"],
                        main: lightBlue["A200"],
                        dark: lightBlue["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.CYAN, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: cyan["A100"],
                        main: cyan["A200"],
                        dark: cyan["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.TEAL, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: teal["A100"],
                        main: teal["A200"],
                        dark: teal["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.GREEN, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: green["A100"],
                        main: green["A200"],
                        dark: green["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.LIGHT_GREEN, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: lightGreen["A100"],
                        main: lightGreen["A200"],
                        dark: lightGreen["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.LIME, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: lime["A100"],
                        main: lime["A200"],
                        dark: lime["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.YELLOW, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: yellow["A100"],
                        main: yellow["A200"],
                        dark: yellow["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.AMBER, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: amber["A100"],
                        main: amber["A200"],
                        dark: amber["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.ORANGE, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: orange["A100"],
                        main: orange["A200"],
                        dark: orange["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
        new ThemeMap({color: ColorTheme.DEEP_ORANGE, mode: ThemeMode.DARK}, createTheme({
                palette: {
                    mode: ThemeMode.DARK,
                    primary: {
                        light: deepOrange["A100"],
                        main: deepOrange["A200"],
                        dark: deepOrange["A400"],
                        contrastText: '#fff',
                    },
                    secondary: {
                        main: '#FF5733'
                    }
                },
            })
        ),
    ]

    private constructor(key: CustomTheme, value: Theme) {
        this.key = key;
        this.value = value;
    }

}