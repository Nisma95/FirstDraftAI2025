import LanguageSwitcher from "@/Components/Langs/LanguageSwitcher";
import ModeSwitcher from "@/Components/Mode/ModeSwitcher";

const HorizontalNavbar = () => {
    return (
        <div className="fixed top-0 right-4 h-16 flex items-center">
            <div className="flex flex-row items-center">
                <LanguageSwitcher />
                <div className="w-8"></div>
                <ModeSwitcher />
            </div>
        </div>
    );
};

export default HorizontalNavbar;
