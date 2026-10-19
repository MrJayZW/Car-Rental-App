import { useParams } from "react-router-dom";

export default function CarDetailsPage() {
    const { id } = useParams();
    return <h1>Details for car number {id}</h1>;
}