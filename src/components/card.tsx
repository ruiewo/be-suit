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

export default function ServiceCard(props: Props) {
  const router = useRouter();
  return (
    <Card sx={{ maxWidth: 345 }} onClick={() => router.push(props.path)}>
      <CardActionArea>
        <CardMedia component="img" height="140" image={props.src} alt="monitor" sx={{ objectFit: 'contain' }} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
