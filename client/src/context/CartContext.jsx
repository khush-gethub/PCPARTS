import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [appliedCoupon, setAppliedCoupon] = useState(() => {
        const savedCoupon = localStorage.getItem('appliedCoupon');
        return savedCoupon ? JSON.parse(savedCoupon) : null;
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (appliedCoupon) {
            localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
        } else {
            localStorage.removeItem('appliedCoupon');
        }
    }, [appliedCoupon]);

    const addToCart = (product) => {
        // Sanitize price: Convert to number, removing currency symbols and commas
        let sanitizedPrice = product.price;
        if (typeof sanitizedPrice === 'string') {
            sanitizedPrice = parseFloat(sanitizedPrice.replace(/[^0-9.]/g, ''));
        }

        const preparedProduct = { ...product, price: sanitizedPrice || 0 };

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === preparedProduct.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === preparedProduct.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...preparedProduct, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prevItems => prevItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
        setAppliedCoupon(null);
    };

    const applyCoupon = (coupon) => {
        setAppliedCoupon(coupon);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            appliedCoupon,
            applyCoupon,
            removeCoupon
        }}>
            {children}
        </CartContext.Provider>
    );
};
