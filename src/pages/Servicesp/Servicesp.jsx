import React from "react";

const services = [
  { icon: "fa-globe", title: "WorldWide Tours", delay: "0.1s" },
  { icon: "fa-hotel", title: "Hotel Reservation", delay: "0.3s" },
  { icon: "fa-user", title: "Travel Guides", delay: "0.5s" },
  { icon: "fa-cog", title: "Event Management", delay: "0.7s" },
  { icon: "fa-globe", title: "WorldWide Tours", delay: "0.1s" },
  { icon: "fa-hotel", title: "Hotel Reservation", delay: "0.3s" },
  { icon: "fa-user", title: "Travel Guides", delay: "0.5s" },
  { icon: "fa-cog", title: "Event Management", delay: "0.7s" },
];

const Servicesp = () => {
  return (
    <>
      {/* Navbar & Hero */}
      <div className="container-fluid position-relative p-0">

        <div className="container-fluid bg-primary py-5 mb-5 hero-header">
          <div className="container py-5">
            <div className="row justify-content-center py-5">
              <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                <h1 className="display-3 text-white animated slideInDown">
                  Services
                </h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li
                      className="breadcrumb-item text-white active"
                      aria-current="page"
                    >
                      Services
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Services
            </h6>
            <h1 className="mb-5">Our Services</h1>
          </div>
          <div className="row g-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="col-lg-3 col-sm-6 wow fadeInUp"
                data-wow-delay={service.delay}
              >
                <div className="service-item-dtls rounded pt-3">
                  <div className="p-4">
                    <i
                      className={`fa fa-3x ${service.icon} text-primary mb-4`}
                    ></i>
                    <h5>{service.title}</h5>
                    <p>
                      Diam elitr kasd sed at elitr sed ipsum justo dolor sed
                      clita amet diam
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Servicesp;
