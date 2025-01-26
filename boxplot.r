# Load required library
library(ggplot2)

# Load your data
data <- read.csv("data.csv", check.names = TRUE)  # Handles column name issues like spaces or special characters

# Combine all columns (excluding User.ID) into one long format manually
metrics <- c(
  rep("Mental demand - Mouse", nrow(data)),
  rep("Mental demand - Touchpad", nrow(data)),
  rep("Physical demand - Mouse", nrow(data)),
  rep("Physical demand - Touchpad", nrow(data)),
  rep("Frustration - Mouse", nrow(data)),
  rep("Frustration - Touchpad", nrow(data)),
  rep("Perceived performance - Mouse", nrow(data)),
  rep("Perceived performance - Touchpad", nrow(data)),
  rep("Effort - Mouse", nrow(data)),
  rep("Effort - Touchpad", nrow(data))
)

scores <- c(
  data$Mental.demand..Mouse,
  data$Mental.demand...Touchpad,
  data$Physical.demand...Mouse,
  data$Physical.demand...Touchpad,
  data$Frustration...Mouse,
  data$Frustration...Touchpad,
  data$Percieved.performance...Mouse,
  data$Percieved.performance...Touchpad,
  data$Effor...Mouse,
  data$Effort...Touchpad
)

# Create a data frame for plotting
plot_data <- data.frame(Metric = metrics, Score = scores)

# Create the box-and-whisker plot
ggplot(plot_data, aes(x = Metric, y = Score)) +
  geom_boxplot(outlier.colour = "blue", outlier.shape = 16, outlier.size = 2, notch = FALSE) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
  labs(title = "Box-and-Whisker Plot for Metrics",
       x = "Metric",
       y = "Score")
