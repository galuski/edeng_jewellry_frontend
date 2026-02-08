import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import JewelryFilter from '../cmps/JewelryFilter.jsx';
import { JewelList } from '../cmps/JewelList.jsx';
import { Loader } from '../cmps/Loader.jsx';
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js';
import { loadJewelry, removeJewelOptimistic, saveJewel } from '../store/actions/jewel.actions.js';
import { ADD_JEWEL_TO_CART, SET_FILTER_BY } from '../store/reducers/jewel.reducer.js';
import Title from '../cmps/Title.jsx';

export function JewelIndex() {
    const { t, ready } = useTranslation();
    const dispatch = useDispatch();
    
    const jewelry = useSelector(storeState => storeState.jewelModule.jewelry);
    const filterBy = useSelector(storeState => storeState.jewelModule.filterBy);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        loadJewelry()
            .then(() => setLoading(false))
            .catch(err => {
                console.log('err:', err);
                showErrorMsg('Cannot load jewelry');
                setLoading(false);
            });
    }, [filterBy]);

    function onSetFilter(filterBy) {
        dispatch({ type: SET_FILTER_BY, filterBy });
    }

    const filteredJewelry = jewelry.filter(jewel => (
        (!filterBy.vendor || jewel.vendor.toLowerCase().includes(filterBy.vendor.toLowerCase())) &&
        (!filterBy.maxPrice || jewel.price <= filterBy.maxPrice) &&
        (!filterBy.designed || jewel.designed === filterBy.designed)
    ));

    return (
        <div>
            <div className="animate__animated animate__fadeIn animate__delay-1s">
            <Title title={t("Jewellry")} orientation="horizontal" />
            </div>
            <main>
                <JewelryFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                {loading ? <Loader /> : <JewelList jewelry={filteredJewelry} />}
            </main>
        </div>
    );
}