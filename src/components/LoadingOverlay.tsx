import ReactLoading from "react-loading";

const LoadingOverlay = () => {
    return (
        <div className="loading-overlay">
            <ReactLoading type="spin" color="#fff" height={50} width={50} />
        </div>
    );
};

export default LoadingOverlay;