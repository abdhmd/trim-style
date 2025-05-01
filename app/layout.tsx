
import { ThemeProvider } from './context/ThemeContext';
import './globals.css';
import { Metadata } from 'next';
import Navbar from './components/Navbar'; // Assuming Navbar is a client component
import Footer from './components/Footer';
import Main from './components/Main';
export const metadata: Metadata = {
  title: 'Trim Style',
  description: 'أفضل منصة لحجز مواعيد الحلاقة بسهولة وسرعة',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="ar" dir="rtl">
      <body>
        <ThemeProvider>
          <Main >
            <Navbar />
            {children}
            <Footer />
          </Main>
        </ThemeProvider>
      </body>
    </html>
  );
}
