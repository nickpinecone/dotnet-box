import { useParams } from 'react-router-dom';
import axios from "axios";

function Init() {
    const params = useParams();
    console.log(params);

    // Call backend here

    return (
        <div>
        </div>
    );
}

export default Init;
