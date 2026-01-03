import React from 'react';
import UniversalCard from './UniversalCard.jsx';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = (props) => {
    const { id, image, title, price, originalPrice, specs, stockStatus, rating, brand, badges } = props;
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Default to ID 1 if not provided for now, handling the mock data
    const productId = id || 1;

    const handleAddToCart = (e) => {
        // e.preventDefault is handled in UniversalCard check, but good to be safe if passed as handler
        console.log("Adding to cart:", title);

        const productToAdd = {
            id: productId,
            image,
            title,
            price,
            specs
        };
        addToCart(productToAdd);
    };

    return (
        <UniversalCard
            image={image}
            title={title}
            brand={brand}
            badges={badges}
            specs={specs}
            price={price}
            originalPrice={originalPrice}
            stockStatus={stockStatus}
            rating={rating}
            primaryAction={{
                label: "Add to Cart",
                onClick: handleAddToCart
            }}
            secondaryAction={{
                label: "Quick View",
                to: `/product/${productId}`
            }}
        />
    );
};

export default ProductCard;
