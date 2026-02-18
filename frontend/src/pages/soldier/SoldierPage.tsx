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
  /* ~70% in left column (middle + bottom left), ~30% in bottom-right */
  const split = Math.max(1, Math.ceil(paragraphs.length * 0.7));
  const leftParagraphs = paragraphs.slice(0, split);
  const rightParagraphs = paragraphs.slice(split);

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

          {/* Rows 2–4: fullText in left column only (beside image) */}
          <div className={styles.fullTextLeft}>
            {bio ? (
              leftParagraphs.length > 0 ? (
                leftParagraphs.map((p, i) => (
                  <Text key={i} mb="sm">
                    {p}
                  </Text>
                ))
              ) : (
                <Text c="dimmed">אין ביוגרפיה זמינה.</Text>
              )
            ) : (
              <Text c="dimmed">אין ביוגרפיה זמינה.</Text>
            )}
          </div>

          {/* Row 5 right: continuation of text in bottom-right tile */}
          <div className={styles.fullTextRight}>
            {rightParagraphs.map((p, i) => (
              <Text key={i} mb="sm">
                {p}
              </Text>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
