import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { Nav } from "./nav";

export const Header = () => {
    return (
        <header className="flex flex-col md:items-center items-start justify-center md:gap-6 mb-[40px] relative">
            <MobileMenu />
            <Logo />
            <Nav className="hidden md:flex items-center" />
        </header>
    );
};
