import React from 'react';
import './BlogDetail.css'; // Add styles if needed

const BlogDetail = () => {
  return (
    <div className="container py-5">
      {/* Resort 1 */}
      <div className="mb-5">
        <h5 className="fw-bold">1. Himalaya Keys Forest Resort, Paro</h5>
        <p>
          A property like no other in its unrivaled architectural design blending into the natural environment, this resort near Paro brings sustainable luxury to acres of coniferous forest. Designed with an eco-friendly concept in mind, you’ll have your pick of 14 cottage rooms that immerse you in the wilderness environment. Large floor to ceiling windows provide ample natural light and a sense of being directly in the trees, while modern amenities inside provide comfort and a good night’s sleep. Located in Paro, in the forests near Drugyel Dzong, it feels isolated and remote despite being only 20 minutes drive from town. Enjoy a quiet walk in the woods, bring a good book to read, or simply enjoy the green scene from bed.
        </p>
        <img
          src=" ../assets/img/blog/cuisine.jpg" // <-- Replace with actual image path
          alt="Himalaya Keys Forest Resort"
          className="img-fluid my-3"
        />
      </div>

      {/* Resort 2 */}
      <div>
        <h5 className="fw-bold text-danger">2. Lotus Camp, Punakha</h5>
        <p>
          One of the most popular campsites in Bhutan sitting on the banks of the MoChhu river, Lotus Camp in Punakha is the perfect blend of adventure and comfort. Glamping at its finest, enjoy comfortable tents, showers, and clean bathrooms. Fall asleep to the sound of the river rushing nearby under a sky full of stars, and amble for a walk along the private riverbank that elicits images of sandy beaches. With gorgeous views of the river and the valley opposite, you can also partake in river rafting activities and enjoy 3 full, home cooked meals a day if you choose. Go swimming in the pool and huddle around the campfire at night. A perfect weekend getaway from Thimphu or as a peaceful pit stop on your way to adventures in Central Bhutan.
        </p>
      </div>
    </div>
  );
};

export default BlogDetail;
