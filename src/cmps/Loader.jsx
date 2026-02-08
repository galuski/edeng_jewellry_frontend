import LogoSVG from './../../public/logo.svg';

export function Loader() {
    return (
        <div className="loader-container">
            <span className="loader"></span>
            <img className="img-loader" src={LogoSVG} alt="logo" />
        </div>
    );
}