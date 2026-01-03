import React from 'react';
import UniversalCard from './UniversalCard.jsx';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = (props) => {
    const { id, image, title, price, originalPrice, specs, stockStatus, rating } = props;
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Default to ID 1 if not provided for now, handling the mock data
    const productId = id || 1;

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation if wrapped in Link
        e.stopPropagation();

        console.log("Adding to cart:", title); // Debug log

        // Construct product object for cart
        const productToAdd = {
            id: productId,
            image,
            title,
            price,
            specs
        };
        addToCart(productToAdd);

        // Optional: Show some visual feedback or toast here? 
        // For now, the Navbar count update is the feedback.
    };

    return (
        <UniversalCard
            image={image}
            title={title}
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
                label: "View",
                to: `/product/${productId}`
            }}
        />
    );
};

export default ProductCard;
