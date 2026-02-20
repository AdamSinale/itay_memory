import { Container, Text, Title, Loader, Center } from "@mantine/core";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSoldierById } from "../../api/http";
import styles from "./SoldierPage.module.css";

export default function SoldierPage() {
  const { id } = useParams<{ id: string }>();

  const { data: soldier, isLoading, isError } = useQuery({
    queryKey: ["soldiers", id],
    queryFn: () => getSoldierById(id!),
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
    ? new Date(soldier.memorial_date).toLocaleDateString("he-IL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const bio = soldier.caption_he || soldier.caption_en || "";
  const paragraphs = bio ? bio.split("\n").filter(Boolean) : [];

  return (
    <div className={styles.page}>
      <Container size="lg" className={styles.pageContent}>
        <div className={styles.heroGrid}>
          {/* Row 1 left */}
          <div className={styles.introText}>
            <Title order={2}>{soldier.name} ז"ל</Title>
            <Text mt="sm">
              {birthYear != null && <>נולד בשנת {birthYear}</>}
              {birthYear != null && memorialDate && <br />}
              {memorialDate != null && <>נפל ב־{memorialDate}</>}
              {(birthYear != null || memorialDate != null) && <br />}
              {soldier.rank}
              {soldier.unit && ` ב${soldier.unit}`}
            </Text>
          </div>

          {/* Right column: image spans multiple rows */}
          <div className={styles.imageWrap}>
            <img src={photoSrc} alt={soldier.name} className={styles.heroImage} />
          </div>

          {/* fullText: beside image then spans full width below */}
          <div className={styles.fullText}>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <Text key={i} mb="sm">
                  {p}
                </Text>
              ))
            ) : (
              <Text c="dimmed">אין ביוגרפיה זמינה.</Text>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
