const Input = ({ label, ...props}) => (
    <di>
        <label>{label}</label>
        <input {...props}/>    
    </di>
);

export default Input;