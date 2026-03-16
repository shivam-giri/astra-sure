import { useRef } from "react";
import { Box, Card, CardContent, Typography, Stack, IconButton, useTheme } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { RampRight } from "@mui/icons-material";

// A single "panel" (slide) with one image + 3 signpost sections.
function SignpostPanel({ image, sections = [] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, // image | content
        minHeight: { xs: 520, md: 460 },
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: isDark ? 6 : 3,
        background: theme.palette.background.paper,
      }}
    >
      {/* Image side */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 220, md: "100%" },
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content side */}
      <CardContent
        sx={{
          p: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 3,
        }}
      >
        {sections.map((s, idx) => (
          <Box key={idx}>
            <Typography
              variant="overline"
              sx={{ letterSpacing: 2, opacity: 0.7 }}
            >
              {s.kicker || `SECTION ${idx + 1}`}
            </Typography>

            <Typography
              variant="h5"
              sx={{ fontWeight: 700, textTransform: "uppercase", mt: 0.5, mb: 0.5 }}
            >
              {s.title}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {s.description}
            </Typography>

            <Typography
              component="a"
              href={s.href || "#"}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 600,
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Learn more →
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

export default function SignpostCarousel({
  slides = []
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Swiper */}
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={1}
        spaceBetween={24}
        pagination={{ clickable: true }}
        onBeforeInit={(swiper) => {
          // Attach external navigation buttons
          // Swiper requires refs to be set before init:
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        style={{ paddingBottom: 48 }} // room for pagination bullets
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <SignpostPanel image={slide.image} sections={slide.sections} />
          </SwiperSlide>
        ))}


      </Swiper>

      {/* External arrows (bottom center) */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "absolute",
          left: "50%",
          bottom: 4,
          transform: "translateX(-50%)",
          zIndex: 2,
          alignItems: "center",
        }}
      >
        <IconButton ref={prevRef} aria-label="Previous" style={{ marginRight: 50 }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <IconButton ref={nextRef} aria-label="Next">
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}
