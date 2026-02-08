import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { SET_FILTER_BY } from "../store/reducers/jewel.reducer"; 

import ringsIMG from "./../../public/images/rings.jpeg"
import braceletsIMG from "./../../public/images/bracelets.jpeg"
import necklacesIMG from "./../../public/images/necklaces.jpeg"
import earringsIMG from "./../../public/images/earrings.jpeg"
import kgoldIMG from "./../../public/images/14kgold.jpeg"
import silverIMG from "./../../public/images/925silver.jpeg"
import menIMG from "./../../public/images/men.jpeg"

export function CategoryList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categories = [
    { 
      type: "Bracelets", 
      label: "Bracelets", 
      img: braceletsIMG
    },
    { 
      type: "Earrings", 
      label: "Earrings", 
      img: earringsIMG
    },
    { 
      type: "Necklaces", 
      label: "Necklaces", 
      img: necklacesIMG 
    },
    { 
      type: "Rings", 
      label: "Rings", 
      img: ringsIMG 
    },
    { 
      type: "14k Gold", 
      label: "14k Gold", 
      img: kgoldIMG 
    },
    { 
      type: "925 Silver", 
      label: "925 Silver", 
      img: silverIMG
    },
    { 
      type: "Men", 
      label: "Men", 
      img: menIMG
    },
  ];

  // --- UPDATED FUNCTION ---
  function onSelectCategory(categoryType) {
    const isMenCategory = categoryType === 'Men';

    const filterBy = { 
        vendor: "", 
        maxPrice: 20000, 
        // 1. Set designed to "men" only if the category is Men
        designed: isMenCategory ? "men" : "", 
        // 2. IMPORTANT: Usually if you filter by design, you might want to 
        // clear the 'type' so it doesn't search for Type="Men" AND Designed="Men".
        // If your backend handles Type="Men", you can leave this as: type: categoryType
        type: isMenCategory ? "" : categoryType 
    };
    
    dispatch({ type: SET_FILTER_BY, filterBy });
    navigate("/jewel");
  }

  return (
    <section className="category-list-container">
      <div className="category-grid">
        {categories.map((cat) => (
          <div 
            key={cat.label} 
            className="category-card" 
            onClick={() => onSelectCategory(cat.type)}
          >
            <img src={cat.img} alt={cat.label} className="category-img" />
            
            <div className="category-overlay">
              <h3>{t(cat.label)}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}