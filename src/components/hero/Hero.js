import React from "react";
import { useNavigate } from "react-router";
import './Hero.scss'

function Hero() {
    const navigate = useNavigate();
    return (
        <div className="Hero">
            <div className="hero-content center">
                <h2 className="heading">Your Shopping Destination</h2>
                <p className="subheading">
                    Simplify your shopping experience with us
                </p>
                <button onClick={() => navigate('/category')} className="cta btn-primary">Explore</button>
            </div>
        </div>
    );
}

export default Hero;
