import ReactLoading from "react-loading";

const Loading = ({className}) => {
    return (
        <div className={className}>
            <ReactLoading type="bubbles" color="#fff" height={50} width={50} />
        </div>
    );
};

export default Loading;