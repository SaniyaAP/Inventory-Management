import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <section id="hero" className="hero section light-background">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center" data-aos="zoom-out">
            <h1>
              Welcome to <span>InventoryPro</span>
            </h1>
            <p>
              Streamline your inventory processes with our advanced management system.
            </p>
            <div className="d-flex">
              <a href="#features" className="btn-get-started">
                Get Started
              </a>
              <a
                href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
                className="glightbox btn-watch-video d-flex align-items-center"
              >
                <i className="bi bi-play-circle"></i>
                <span>Watch Demo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
