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
        mb: 2,
        border: `1px solid ${
          theme.customColors?.border?.light || theme.palette.divider
        }`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header do card */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <MuiSkeleton
              variant="rounded"
              height={24}
              width="60%"
              sx={{ mb: 1 }}
            />
            <MuiSkeleton
              variant="rounded"
              height={20}
              width={80}
              sx={{ borderRadius: 10 }}
            />
          </Box>
          <MuiSkeleton
            variant="rounded"
            height={24}
            width={100}
            sx={{ borderRadius: 12 }}
          />
        </Box>

        {/* Detalhes */}
        <Box sx={{ mb: 3 }}>
          <MuiSkeleton
            variant="rounded"
            height={16}
            width="40%"
            sx={{ mb: 1 }}
          />
          <MuiSkeleton
            variant="rounded"
            height={16}
            width="80%"
            sx={{ mb: 2 }}
          />
          <MuiSkeleton
            variant="rounded"
            height={16}
            width="30%"
            sx={{ mb: 1 }}
          />
          <MuiSkeleton variant="rounded" height={16} width="65%" />
        </Box>

        {/* Ações */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <MuiSkeleton
            variant="rounded"
            height={32}
            width={120}
            sx={{ borderRadius: 1 }}
          />
          <MuiSkeleton
            variant="rounded"
            height={32}
            width={140}
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
    <Box sx={{ mt: 4 }}>
      {/* Header skeleton */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: `1px solid ${
            theme.customColors?.border?.light || theme.palette.divider
          }`,
          background:
            theme.customColors?.surface?.warm || theme.palette.background.paper,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <MuiSkeleton
            variant="rounded"
            height={32}
            width="60%"
            sx={{ mb: 2 }}
          />
          <MuiSkeleton
            variant="rounded"
            height={20}
            width="40%"
            sx={{ mb: 1 }}
          />
          <MuiSkeleton variant="rounded" height={20} width="50%" />
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
