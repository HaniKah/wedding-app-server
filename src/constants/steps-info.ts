import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { StepsInfo } from '../types/planner/steps.dto';

export const stepsInfo: Record<WeddingSteps, StepsInfo> = {
  [WeddingSteps.Date]: {
    title: 'Date',
    description: 'Choose and confirm the wedding date.',
  },
  [WeddingSteps.Host]: {
    title: 'Host',
    description: 'Select the master of ceremonies or wedding host.',
  },
  [WeddingSteps.Dress]: {
    title: 'Dress',
    description: 'Find and fit the wedding dress.',
  },
  [WeddingSteps.Photographer]: {
    title: 'Photographer',
    description: 'Book a photographer to capture the wedding day.',
  },
  [WeddingSteps.Dj]: {
    title: 'DJ',
    description: 'Hire a DJ to provide music and entertainment.',
  },
  [WeddingSteps.MakeUpArtist]: {
    title: 'Make-up Artist',
    description: 'Arrange a make-up artist for the bride and bridal party.',
  },
  [WeddingSteps.Decorator]: {
    title: 'Decorator',
    description: 'Organize decorations for the wedding venue.',
  },
  [WeddingSteps.Catering]: {
    title: 'Catering',
    description: 'Choose a catering service for food and drinks.',
  },
  [WeddingSteps.Coordinator]: {
    title: 'Coordinator',
    description: 'Hire a wedding coordinator to manage the event.',
  },
  [WeddingSteps.DancingCourse]: {
    title: 'Dancing Course',
    description: 'Take dancing lessons for the first dance.',
  },
  [WeddingSteps.Aarada]: {
    title: 'Aarada',
    description: 'Arrange the traditional Aarada performance.',
  },
  [WeddingSteps.Car]: {
    title: 'Car',
    description: 'Book the wedding car or transportation.',
  },
  [WeddingSteps.HotelAfterWedding]: {
    title: 'Hotel After Wedding',
    description: 'Reserve a hotel stay for after the wedding.',
  },
  [WeddingSteps.Giveaways]: {
    title: 'Giveaways',
    description: 'Prepare wedding favors or giveaways for guests.',
  },
  [WeddingSteps.MusiciansAndPerformers]: {
    title: 'Musicians and Performers',
    description: 'Book live musicians, singers, or performers.',
  },
  [WeddingSteps.Jewelry]: {
    title: 'Jewelry',
    description: 'Purchase or arrange jewelry for the couple.',
  },
  [WeddingSteps.Perfumes]: {
    title: 'Perfumes',
    description: 'Select perfumes for the bride and groom.',
  },
  [WeddingSteps.Hammam]: {
    title: 'Hammam',
    description: 'Plan a hammam (traditional bath) session before the wedding.',
  },
  [WeddingSteps.CosmeticClinics]: {
    title: 'Cosmetic Clinics',
    description: 'Book beauty or cosmetic treatments ahead of the wedding.',
  },
  [WeddingSteps.ExtraDecorations]: {
    title: 'Extra Decorations',
    description: 'Arrange any additional or custom decorations.',
  },
};
