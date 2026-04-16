import { StepsInfo } from '../types/planner/steps.dto';
import { Categories } from '../types/general/categories';

export const stepsInfo: Record<Categories, StepsInfo> = {
  [Categories.Host]: {
    title: 'Host',
    description: 'Select the master of ceremonies or wedding host.',
  },
  [Categories.Dress]: {
    title: 'Dress',
    description: 'Find and fit the wedding dress.',
  },
  [Categories.Photographer]: {
    title: 'Photographer',
    description: 'Book a photographer to capture the wedding day.',
  },
  [Categories.Dj]: {
    title: 'DJ',
    description: 'Hire a DJ to provide music and entertainment.',
  },
  [Categories.MakeUpArtist]: {
    title: 'Make-up Artist',
    description: 'Arrange a make-up artist for the bride and bridal party.',
  },
  [Categories.Decorator]: {
    title: 'Decorator',
    description: 'Organize decorations for the wedding venue.',
  },
  [Categories.Catering]: {
    title: 'Catering',
    description: 'Choose a catering service for food and drinks.',
  },

  [Categories.DancingCourse]: {
    title: 'Dancing Course',
    description: 'Take dancing lessons for the first dance.',
  },
  [Categories.Aarada]: {
    title: 'Aarada',
    description: 'Arrange the traditional Aarada performance.',
  },
  [Categories.Car]: {
    title: 'Car',
    description: 'Book the wedding car or transportation.',
  },

  [Categories.Giveaways]: {
    title: 'Giveaways',
    description: 'Prepare wedding favors or giveaways for guests.',
  },
  [Categories.MusiciansAndPerformers]: {
    title: 'Musicians and Performers',
    description: 'Book live musicians, singers, or performers.',
  },
  [Categories.Jewelry]: {
    title: 'Jewelry',
    description: 'Purchase or arrange jewelry for the couple.',
  },
  [Categories.Perfumes]: {
    title: 'Perfumes',
    description: 'Select perfumes for the bride and groom.',
  },
  [Categories.Hammam]: {
    title: 'Hammam',
    description: 'Plan a hammam (traditional bath) session before the wedding.',
  },
  [Categories.CosmeticClinics]: {
    title: 'Cosmetic Clinics',
    description: 'Book beauty or cosmetic treatments ahead of the wedding.',
  },
  [Categories.Fireworks]: {
    title: 'Fireworks',
    description: 'Lighten up your wedding day with fireworks.',
  },
  [Categories.Extra]: {
    title: 'Extra Decorations',
    description: 'Arrange any additional or custom decorations.',
  },
};
