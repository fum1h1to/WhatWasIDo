import { Box, LinearProgress } from "@mui/material";

const Loading = (props: {
  disable: boolean
}) => {

  return (
    <Box
      sx={{
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        display: (props.disable ? 'block' : 'none'),
      }}
    >
      <LinearProgress
        color='progress'
        sx={{
          bgcolor: 'transparent'
        }}
      />
    </Box>
  );
}

export default Loading;