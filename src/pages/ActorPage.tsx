import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPersonDetails, fetchPersonCombinedCredits } from "../api/tmdb";
import type { PersonDetails, Credit } from "../api/tmdb";
import "../components/css/ActorPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { formatDate } from "../utils/date";

export default function ActorPage() {
    const { id } = useParams();
    const personId = Number(id);

    const [person, setPerson] = useState<PersonDetails | null>(null);
    const [credits, setCredits] = useState<Credit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"acting" | "crew">("acting");

    useEffect(() => {
        async function load() {
            try {
                const [details, combined] = await Promise.all([
                    fetchPersonDetails(personId),
                    fetchPersonCombinedCredits(personId),
                ]);

                setPerson(details);

                const merged = [...combined.cast, ...combined.crew]
                setCredits(merged);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [personId]);

    // Separate Acting / Crew credits
    const actingCredits = React.useMemo(
        () => credits.filter(c => c.character),
        [credits]
    );

    const crewCredits = React.useMemo(
        () => credits.filter(c => c.job && !c.character),
        [credits]
    );

    // Top 6 Known For by vote_count
    const knownFor = React.useMemo(
        () =>
            actingCredits
                .filter(c => c.poster_path)
                .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
                .slice(0, 6),
        [actingCredits]
    );

    // Sort filmography: movies first, then TV; movies by vote_count, TV by date
    const sortCredits = (arr: Credit[]) =>
        arr
            .slice()
            .sort((a, b) => {
                if (a.media_type === "movie" && b.media_type === "tv") return -1;
                if (a.media_type === "tv" && b.media_type === "movie") return 1;
                if (a.media_type === "movie" && b.media_type === "movie")
                    return (b.vote_count || 0) - (a.vote_count || 0);
                const dateA = new Date(a.first_air_date || a.release_date || "");
                const dateB = new Date(b.first_air_date || b.release_date || "");
                return dateB.getTime() - dateA.getTime();
            });

    const actingCreditsSorted = React.useMemo(
        () => sortCredits(actingCredits),
        [actingCredits]
    );

    const crewCreditsSorted = React.useMemo(
        () => sortCredits(crewCredits),
        [crewCredits]
    );

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!person) return null;

    return (
        <>
            <Header />
            <div className="actor-page">

                {/* Photo + Personal Info */}
                <div className="actor-left-section">
                    {person.profile_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w400${person.profile_path}`}
                            alt={person.name}
                            className="actor-photo"
                        />
                    )}
                    <div className="actor-info">
                        <h3>Personal Info</h3>

                        {person.known_for_department && <p><strong><bdi>Known For</bdi></strong>{person.known_for_department}</p>}
                        {person.gender && <p><strong><bdi>Gender</bdi></strong>{person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Unknown"}</p>}
                        {person.birthday && <p><strong><bdi>Birthday</bdi></strong>{formatDate(person.birthday)}</p>}
                        {person.place_of_birth && <p><strong><bdi>Place of Birth</bdi></strong>{person.place_of_birth}</p>}
                        {person.deathday && <p><strong><bdi>Died</bdi></strong>{person.deathday}</p>}
                        {person.also_known_as && person.also_known_as.length > 0 && (
                            <div><strong><bdi>Also Known As</bdi></strong>
                                {person.also_known_as.map((str, i) => <p key={i} className="actor-info-knownAs">{str}</p>)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="actor-content">
                    <h2 className="actor-name">{person.name}</h2>

                    {/* Biography */}
                    {person.biography && (
                        <section className="biography">
                            <h3 className="biography-title">Biography</h3>
                            <div className="biography-text">
                                {person.biography.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}</div>
                        </section>
                    )}

                    {/* Known For */}
                    {knownFor.length > 0 && (
                        <section className="known-for">
                            <h3 className="known-for-title">Known For</h3>
                            <div className="known-for-row">
                                {knownFor.map(c => (
                                    <div className="known-for-card" key={c.id}>
                                        <img src={`https://image.tmdb.org/t/p/w300${c.poster_path}`} alt={c.title || c.name} />
                                        <p>{c.title || c.name}</p>
                                    </div>
                                ))}
                            </div>

                        </section>
                    )}

                    {/* Filmography Tabs*/}
                    <section className="filmography">
                        <div className="filmography-tabs">
                            <button
                                className={activeTab === "acting" ? "active" : ""}
                                onClick={() => setActiveTab("acting")}
                            >
                                Acting
                            </button>
                            <button
                                className={activeTab === "crew" ? "active" : ""}
                                onClick={() => setActiveTab("crew")}
                            >
                                Crew
                            </button>
                        </div>

                        {/* Credits List */}
                        <div className="credits-list">
                            {(activeTab === "acting"
                                ? actingCreditsSorted
                                : crewCreditsSorted
                            ).map((c) => (
                                <div
                                    className="credit-item"
                                    key={`${c.id}-${c.character ?? c.job ?? ""}`}
                                >
                                    {c.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${c.poster_path}`}
                                            alt={c.title || c.name}
                                        />
                                    ) : (
                                        <div className="credit-no-image">No Image</div>
                                    )}
                                    <div className="credit-info">
                                        <p className="credit-title">{c.title || c.name}</p>
                                        {c.character && (
                                            <p className="credit-role">as {c.character}</p>
                                        )}
                                        {c.job && <p className="credit-role">{c.job}</p>}
                                        <p className="credit-year">
                                            {(c.release_date || c.first_air_date || "").slice(0, 4)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}
