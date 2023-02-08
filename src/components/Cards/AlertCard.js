
export default function AlertCard(alert) {

    return (
        <div>
            <h2>{alert.title}</h2>
            <p>{alert.description}</p>
        </div>
    );
}