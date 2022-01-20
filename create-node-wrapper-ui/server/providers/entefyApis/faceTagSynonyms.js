// Should eventually have logic for combinations of these things
module.exports = {
  'gender': {
    'male.s.02': {
      'adjectives': ['male.s.02'],
      'nouns'     : ['male_child.n.01', 'male.n.02', 'man.n.01', 'gentleman.n.01', 'guy.n.01']
    },
    'female.s.02': {
      'adjectives': ['female.s.02'],
      'nouns'     : ['girl.n.01', 'female.n.02', 'woman.n.01', 'lady.n.01', 'gal.n.03', 'dame.n.01']
    }
  },
  'age': {
    'young.a.01': {
      'adjectives': ['young.a.01', 'little.s.03', 'infantile.s.03'],
      'nouns'     : ['child.n.01', 'baby.n.01', 'preteen.n.01']
    },
    'adult.s.01': {
      'adjectives': ['adolescent.s.02', 'adult.s.01'],
      'nouns'     : ['adolescent.n.01', 'adult.n.01', 'juvenile.n.01']
    },
    'old.a.01': {
      'adjectives': ['old.a.01', 'aged.s.01'],
      'nouns'     : ['oldster.n.01', 'old-timer.n.02', 'retiree.n.01']
    }
  },
  'emotions': {
    'angry.a.01': {
      'adjectives': ['angry.a.01'],
      'nouns'     : ['anger.n.01', 'frustration.n.01', 'fury.n.01', 'hate.n.01']
    },
    'disgusted.s.01': {
      'adjectives': ['disgusted.s.01'],
      'nouns'     : ['disgust.n.01', 'indignation.n.01']
    },
    'fearful.s.01': {
      'adjectives': ['fearful.s.01'],
      'nouns'     : ['fear.n.01', 'panic.n.01', 'horror.n.01', 'apprehension.n.01', 'concern.n.01']
    },
    'happy.a.01': {
      'adjectives': ['happy.a.01'],
      'nouns'     : ['happiness.n.01', 'cheerfulness.n.01', 'joy.n.02', 'ecstasy.n.01', 'elation.n.02']
    },
    'neutral.a.04': {
      'adjectives': ['neutral.a.04'],
      'nouns'     : ['disinterest.n.01']
    },
    'sad.a.01': {
      'adjectives': ['sad.a.01'],
      'nouns'     : ['sadness.n.01', 'grief.n.01', 'misery.n.01', 'despair.n.01', 'anguish.n.01']
    },
    'surprised.a.01': {
      'adjectives': ['surprised.a.01'],
      'nouns'     : ['awe.n.01', 'daze.n.01', 'astonishment.n.01', 'surprise.n.01']
    }
  }
};
