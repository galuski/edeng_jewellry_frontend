export default function Title({ title, orientation = "horizontal" }) {
    return (
        <section className={`title ${orientation}`}>
            <div className={`line ${orientation}`}></div>
            <div className="point"><h1 className=" title-dot animate__animated animate__pulse animate__infinite animate__slower">{title}</h1></div>
            <div className={`line ${orientation}`}></div>
        </section>
    );
}



