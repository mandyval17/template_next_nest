"use client";

import ExampleService from "@/services/example/example.services";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

export function ExampleList() {
  const { data, isLoading, error } = ExampleService.getExamples({});
  const examples = data?.data;

  return (
    <Card sx={{ flex: 1, minWidth: 280 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Examples (useQuery)
        </Typography>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {error && (
          <Typography variant="body2" color="error">
            {error?.response?.data?.message ?? error.message}
          </Typography>
        )}
        {examples && (
          <List dense disablePadding>
            {examples.length === 0 ? (
              <ListItem>
                <ListItemText primary="No examples yet" secondary="Create one above." />
              </ListItem>
            ) : (
              examples.map((ex) => (
                <ListItem key={ex.id} disablePadding>
                  <ListItemText
                    primary={ex.name}
                    secondary={`${ex.email} · ${ex.id.slice(0, 8)}…`}
                  />
                </ListItem>
              ))
            )}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
