import React from 'react';
import UniversalCard from './UniversalCard.jsx';
import { useNavigate } from 'react-router-dom';

const PCCard = ({ id, name, image, cpu, gpu, ram, price, useCase, rating }) => {
    const navigate = useNavigate();

    return (
        <UniversalCard
            image={image}
            title={name}
            badges={[useCase, 'Pro-Assembled']}
            specs={[
                { label: 'CPU', val: cpu },
                { label: 'GPU', val: gpu },
                { label: 'RAM', val: ram }
            ]}
            price={price}
            rating={rating}
            primaryAction={{
                label: "Buy Now",
                onClick: () => navigate(`/ready-made-pc/${id}`)
            }}
            secondaryAction={{
                label: "View Build Details",
                onClick: () => navigate(`/ready-made-pc/${id}`)
            }}
        />
    );
};

export default PCCard;
