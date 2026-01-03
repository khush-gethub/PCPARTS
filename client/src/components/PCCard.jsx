import React from 'react';
import UniversalCard from './UniversalCard.jsx';
import { useNavigate } from 'react-router-dom';

const PCCard = ({ id, name, image, cpu, gpu, ram, price, useCase, rating }) => {
    const navigate = useNavigate();

    return (
        <UniversalCard
            image={image}
            title={name}
            badges={[useCase]}
            specs={[
                `CPU: ${cpu}`,
                `GPU: ${gpu}`,
                `RAM: ${ram}`
            ]}
            price={price}
            rating={rating}
            primaryAction={{
                label: "View Details",
                onClick: () => navigate(`/ready-made-pc/${id}`)
            }}
        // Optional: Secondary action could be "Configure" if that feature existed
        />
    );
};

export default PCCard;
