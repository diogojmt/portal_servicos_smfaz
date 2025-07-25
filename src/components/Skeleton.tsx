import React from "react";
import {
  Box,
  Card,
  CardContent,
  Skeleton as MuiSkeleton,
  useTheme,
} from "@mui/material";

interface SkeletonProps {
  height?: string | number;
  width?: string | number;
  borderRadius?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  height = "1rem",
  width = "100%",
  borderRadius = 1,
  className = "",
}) => {
  return (
    <MuiSkeleton
      variant="rounded"
      height={height}
      width={width}
      className={className}
      sx={{ borderRadius }}
      aria-hidden="true"
    />
  );
};

export const PertenceCardSkeleton: React.FC = () => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        mb: { xs: 1.5, sm: 2 },
        border: `1px solid ${
          theme.customColors?.border?.light || theme.palette.divider
        }`,
        borderRadius: { xs: theme.designTokens?.borderRadius.md || 4, sm: 2 },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header do card */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "flex-start" },
            mb: { xs: 1, sm: 2 },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box>
            <MuiSkeleton
              variant="rounded"
              height={20}
              width={"60%"}
              sx={{ mb: { xs: 0.5, sm: 1 } }}
            />
            <MuiSkeleton
              variant="rounded"
              height={16}
              width={64}
              sx={{ borderRadius: 8 }}
            />
          </Box>
          <MuiSkeleton
            variant="rounded"
            height={20}
            width={80}
            sx={{ borderRadius: 10 }}
          />
        </Box>

        {/* Detalhes */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <MuiSkeleton
            variant="rounded"
            height={14}
            width="40%"
            sx={{ mb: { xs: 0.5, sm: 1 } }}
          />
          <MuiSkeleton
            variant="rounded"
            height={14}
            width="80%"
            sx={{ mb: { xs: 1, sm: 2 } }}
          />
          <MuiSkeleton
            variant="rounded"
            height={14}
            width="30%"
            sx={{ mb: { xs: 0.5, sm: 1 } }}
          />
          <MuiSkeleton variant="rounded" height={14} width="65%" />
        </Box>

        {/* Ações */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 0.5, sm: 1 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <MuiSkeleton
            variant="rounded"
            height={28}
            width={100}
            sx={{ borderRadius: 1, mb: { xs: 0.5, sm: 0 } }}
          />
          <MuiSkeleton
            variant="rounded"
            height={28}
            width={110}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export const LoadingSkeleton: React.FC<{ count?: number }> = ({
  count = 2,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: { xs: 2, sm: 4 } }}>
      {/* Header skeleton */}
      <Card
        elevation={0}
        sx={{
          mb: { xs: 2, sm: 4 },
          border: `1px solid ${
            theme.customColors?.border?.light || theme.palette.divider
          }`,
          background:
            theme.customColors?.surface?.warm || theme.palette.background.paper,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <MuiSkeleton
            variant="rounded"
            height={24}
            width="60%"
            sx={{ mb: { xs: 1, sm: 2 } }}
          />
          <MuiSkeleton
            variant="rounded"
            height={16}
            width="40%"
            sx={{ mb: { xs: 0.5, sm: 1 } }}
          />
          <MuiSkeleton variant="rounded" height={16} width="50%" />
        </CardContent>
      </Card>

      {/* Cards de pertences skeleton */}
      <Box>
        {Array.from({ length: count }, (_, index) => (
          <PertenceCardSkeleton key={index} />
        ))}
      </Box>
    </Box>
  );
};

export default Skeleton;
