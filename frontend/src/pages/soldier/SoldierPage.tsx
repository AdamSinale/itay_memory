import { Container, Text, Title, Loader, Center } from "@mantine/core";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getSoldierById } from "../../api/http";
import styles from "./SoldierPage.module.css";

export default function SoldierPage() {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const lang = i18n.language === "he" ? "he" : "en";
  const isHe = lang === "he";

  const { data: soldier, isLoading, isError } = useQuery({
    queryKey: ["soldiers", id, lang],
    queryFn: () => getSoldierById(id!, lang),
    enabled: Boolean(id),
  });

  if (!id) return <Navigate to="/" replace />;
  if (isLoading)
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  if (isError || !soldier) return <Navigate to="/" replace />;

  const photoUrl = soldier.photo_url || "placeholder-soldier.svg";
  const photoSrc = photoUrl.startsWith("/") ? photoUrl : `/images/${photoUrl}`;

  const birthYear = soldier.birth_date ? new Date(soldier.birth_date).getFullYear() : null;

  const memorialDate = soldier.memorial_date
    ? new Date(soldier.memorial_date).toLocaleDateString(isHe ? "he-IL" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : null;

  const bio = soldier.caption || "";
  const paragraphs = bio ? bio.split("\n").filter(Boolean) : [];

  return (
    <Container size="lg" className={styles.pageContent}>
      <div className={styles.heroGrid}>
        <div className={styles.soldierName}>
          <Title>{soldier.name} {isHe ? 'ז"ל' : "R.I.P"}</Title>
        </div>
        
        <div className={styles.soldierBasicInfo}>
          <Text mt="sm">
            {birthYear != null && <>{isHe ? "נולד בשנת" : "Born in"} {birthYear}</>}
            {birthYear != null && memorialDate && <br />}
            {memorialDate != null && <>{isHe ? "נפל ב־" : "Fell on "}{memorialDate}</>}
            {(birthYear != null || memorialDate != null) && <br />}
            {soldier.rank}
            {soldier.unit && (isHe ? ` ב${soldier.unit}` : `, ${soldier.unit}`)}
          </Text>
        </div>

        <div className={styles.soldierImage}>
          <img src={photoSrc} alt={soldier.name} className={styles.heroImage} />
        </div>

        <div className={styles.soldierBio}>
          <div className={`${styles.soldierBioContent} ${isHe ? styles.soldierBioContentRtl : styles.soldierBioContentLtr}`}>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <Text key={i} mb="sm">
                  {p}
                </Text>
              ))
            ) : (
              <Text c="dimmed">{isHe ? "אין ביוגרפיה זמינה." : "No biography available."}</Text>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
