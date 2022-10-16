import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useRouter } from 'next/router';

type Props = {
  src: string;
  title: string;
  description: string;
  path: string;
};

export default function MainMenuCard({ src, title, description, path }: Props) {
  const router = useRouter();
  return (
    <Card sx={{ width: 345, height: 280 }} onClick={() => router.push(path)}>
      <CardActionArea sx={{ height: '100%' }}>
        <CardMedia component="img" height="140" image={src} alt="monitor" sx={{ objectFit: 'contain' }} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
