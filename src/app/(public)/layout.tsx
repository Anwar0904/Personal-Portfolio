
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/navbar/Navbar";


export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>

            <Navbar />

            <main className="min-h-screen overflow-x-hidden">

                {children}

            </main>

            <Footer />

        </>
    );
}