import localFont from 'next/font/local'

// Load Axiforma font from the public/fonts directory
export const axiforma = localFont({
  src: [
    {
      path: '../fonts/Kastelov - Axiforma Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../fonts/Kastelov - Axiforma Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/Kastelov - Axiforma Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Kastelov - Axiforma Book.otf',
      weight: '450',
      style: 'normal',
    },
    {
      path: '../fonts/Kastelov - Axiforma Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Kastelov - Axiforma SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/Kastelov - Axiforma Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Kastelov - Axiforma ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../fonts/Kastelov - Axiforma Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/Kastelov - Axiforma Heavy.otf',
      weight: '950',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-axiforma',
  fallback: ['Axiforma', 'system-ui', 'sans-serif'],
  preload: true,
}) 