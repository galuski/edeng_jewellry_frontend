import { useTranslation } from "react-i18next";
import { logout } from '../store/actions/user.actions.js';
import { SET_USER } from '../store/reducers/user.reducer.js';
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js';
import { useSelector } from 'react-redux';
import { Link, useNavigate, Outlet } from 'react-router-dom';




export function AdminSettings() {
    const { t, ready } = useTranslation();
    const user = useSelector(storeState => storeState.userModule.loggedinUser);
    const navigate = useNavigate();


    const onLogout = () => {
        logout()
            .then(() => {
                showSuccessMsg('Logout successfully');
                navigate('/login'); // ניווט אחרי התנתקות

            })
            .catch(err => {
                console.log('err:', err);
                showErrorMsg('Cannot logout');
            });
    };


    return (
        <section className="admin-settings">
            <nav className="admin-nav">
                <ul>
                    <li className="admin-li"><Link to="/login/admin-settings/list">{t("Jewelry List")}</Link></li>
                    <li className="admin-li"><Link to="/login/admin-settings/add">{t("Add Jewel")}</Link></li>
                    <li className="admin-li"><Link to="/login/admin-settings/push">{t("Add Push")}</Link></li>
                </ul>
                <button onClick={onLogout}>Logout</button>

            </nav>
            <Outlet />
        </section>
    )
}