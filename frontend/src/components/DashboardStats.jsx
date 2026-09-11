import "../css/components/DashboardStats.css";

function DashboardStats ({stats}) {

    return (
        <section className="dashboard-stats" aria-label="Dashboard statistics">
            {stats.map((stat) => (
                <article className="stat-card" key={stat.label}>

                    <span className="stat-label">
                        {stat.label}
                    </span>

                    <strong className="stat-value">
                        {stat.value}
                    </strong>

                    <span className="stat-detail">
                        {stat.detail}
                    </span>

                </article>
            ))}
        </section>
    );

}

export default DashboardStats;