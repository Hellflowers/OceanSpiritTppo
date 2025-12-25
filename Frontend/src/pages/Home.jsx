import { useState, useEffect } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import AdCard from "../components/AdCard";

function Home({ user, setUser }) {
    const [query, setQuery] = useState("");
    const [ads, setAds] = useState([]);

    useEffect(() => {
        const storedAds = JSON.parse(localStorage.getItem("ads")) || [];
        setAds(storedAds);
    }, []);

    const filteredAds = ads.filter(ad =>
        ad.title.toLowerCase().includes(query.toLowerCase())
    );

    const hasAds = filteredAds.length > 0;

    return (
        <>
            <Header user={user} setUser={setUser} />
            <SearchBar onSearch={setQuery} />

            {hasAds ? (
                <div className="ads-list">
                    {filteredAds.map(ad => (
                        <AdCard key={ad.id} ad={ad} />
                    ))}
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "60vh",
                        textAlign: "center",
                        padding: "20px",
                        color: "#666"
                    }}
                >
                    {query ? (
                        <>
                            <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                                По запросу "{query}" ничего не найдено
                            </p>
                            <p style={{ fontSize: "14px", color: "#888", marginBottom: "16px" }}>
                                Попробуйте изменить поисковый запрос
                            </p>
                            <button
                                onClick={() => setQuery("")}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#f0f0f0",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Показать все объявления
                            </button>
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                                Объявления отсутствуют
                            </p>
                            <p style={{ fontSize: "14px", color: "#888" }}>
                                Будьте первым, кто разместит объявление
                            </p>
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default Home;