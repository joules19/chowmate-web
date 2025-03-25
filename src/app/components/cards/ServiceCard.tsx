import { Icon } from "@iconify/react";

interface ServiceCardProps {
    icon: string;
    title: string;
    description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
    return (
        <div className="flex flex-col flex-1 items-center text-center">
            <div className="mb-4 bg-primary-1 p-4 rounded-lg">
                <Icon icon={icon} width={42} height={42} color="white" />
            </div>
            <h3 className="text-[24px] font-semibold">{title}</h3>
            <p className="text-[15px] font-normal mt-6">{description}</p>
        </div>
    );
};

export default ServiceCard;
