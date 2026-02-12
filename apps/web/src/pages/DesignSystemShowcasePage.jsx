import {
  Card,
  HomeHero,
  HeroMobile,
  ProfileMenuPattern,
  Text,
  UserProfilesPattern,
  VideoPlayerChangingSoundPattern,
  VideoPlayerEpisodesPreviewPattern,
  VideoPlayerNextEpisodePattern,
  VideoPlayerPattern,
  VideoPlayerPlaybackSpeedPattern,
  VideoPlayerScrollPreviewPattern,
  VideoPlayerSubtitlesPattern,
} from '@flix/design-system/components';

const controlLabels = {
  play: 'Play',
  back10: 'Back 10 seconds',
  forward10: 'Forward 10 seconds',
  sound: 'Sound',
  nextEpisode: 'Next episode',
  listOfEpisodes: 'Episode list',
  subtitles: 'Subtitles',
  speed: 'Playback speed',
  fullScreen: 'Full screen',
};

const episodeItems = [
  {
    id: 'ep-1',
    title: 'Chapter 1',
    episodeLabel: 'Episode 1',
    description: 'An opening with high tension and a fast pace.',
    artworkUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    playLabel: 'Play chapter 1',
  },
  {
    id: 'ep-2',
    title: 'Chapter 2',
    episodeLabel: 'Episode 2',
    description: 'The conflict expands and the team reacts.',
    artworkUrl: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1200&q=80',
    playLabel: 'Play chapter 2',
  },
];

const playerProps = {
  backdropImageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
  progress: {
    elapsedLabel: '15:52',
    remainingLabel: '-27:18',
    progressPercent: 64,
    bufferPercent: 70,
    markerPercent: 64,
  },
  controlLabels,
};

export const DesignSystemShowcasePage = () => (
  <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--fx-space-6)', display: 'grid', gap: 'var(--fx-space-6)' }}>
    <Card>
      <Text as="h1" variant="display-large" style={{ margin: 0 }}>Design System Showcase</Text>
      <Text as="p" variant="regular-body" tone="secondary" style={{ margin: 'var(--fx-space-2) 0 0' }}>
        Página de referência para tokens, atoms, molecules, organisms e patterns implementados.
      </Text>
    </Card>

    <section style={{ display: 'grid', gap: 'var(--fx-space-4)' }}>
      <Text as="h2" variant="medium-title2">Hero Variants</Text>
      <HomeHero
        backgroundImageUrl="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1800&q=80"
        brandLabel="Netflix"
        headerItems={[{ label: 'Home', href: '#', active: true }, { label: 'Series', href: '#' }]}
        searchControlLabel="Search"
        notificationsControlLabel="Notifications"
        profileControlLabel="Profile"
        title="House of Ninjas"
        description="A retired family returns to confront a chain of rising threats."
      />
      <HeroMobile
        backgroundImageUrl="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1800&q=80"
        previewImageUrl="https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1200&q=80"
        eyebrow="Series"
        title="House of Ninjas"
        playLabel="Play"
        playControlLabel="Play"
        addControlLabel="Add"
        thumbUpControlLabel="Thumb up"
        muteControlLabel="Mute"
        closeControlLabel="Close"
      />
    </section>

    <section style={{ display: 'grid', gap: 'var(--fx-space-4)' }}>
      <Text as="h2" variant="medium-title2">User Profile</Text>
      <UserProfilesPattern
        profiles={[
          {
            id: 'p1',
            label: 'Ana',
            imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            selected: true,
            ariaLabel: 'Select Ana',
          },
          {
            id: 'p2',
            label: 'Chris',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            ariaLabel: 'Select Chris',
          },
        ]}
        addProfile={{ label: 'Add Profile', ariaLabel: 'Add profile' }}
      />

      <ProfileMenuPattern
        accounts={[
          {
            id: 'm1',
            label: 'Ana',
            imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            ariaLabel: 'Switch to Ana',
          },
          {
            id: 'm2',
            label: 'Chris',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            ariaLabel: 'Switch to Chris',
          },
        ]}
        actions={[
          { id: 'a1', label: 'Manage Profiles', ariaLabel: 'Manage profiles', iconName: 'pensil' },
          { id: 'a2', label: 'Account', ariaLabel: 'Open account', iconName: 'person' },
          { id: 'a3', label: 'Help Center', ariaLabel: 'Open help center', iconName: 'question', muted: true },
        ]}
        footerAction={{ label: 'Sign out', ariaLabel: 'Sign out' }}
      />
    </section>

    <section style={{ display: 'grid', gap: 'var(--fx-space-4)' }}>
      <Text as="h2" variant="medium-title2">Video Player Patterns</Text>
      <VideoPlayerPattern {...playerProps} />
      <VideoPlayerChangingSoundPattern playerProps={playerProps} volumePercent={68} volumeLabel="Volume" />
      <VideoPlayerPlaybackSpeedPattern
        playerProps={playerProps}
        title="Playback Speed"
        speeds={[
          { id: 's1', label: '0.5x' },
          { id: 's2', label: '1.0x', selected: true },
          { id: 's3', label: '1.25x' },
          { id: 's4', label: '1.5x' },
        ]}
      />
      <VideoPlayerSubtitlesPattern
        playerProps={playerProps}
        title="Subtitles"
        options={[
          { id: 'sub-1', label: 'Off' },
          { id: 'sub-2', label: 'English', selected: true },
          { id: 'sub-3', label: 'Portuguese' },
        ]}
      />
      <VideoPlayerEpisodesPreviewPattern playerProps={playerProps} title="Episodes" episodes={episodeItems} />
      <VideoPlayerNextEpisodePattern
        playerProps={playerProps}
        card={{
          title: 'Next Chapter',
          episodeLabel: 'Up next',
          description: 'Continue playback with the following episode.',
          artworkUrl: episodeItems[0].artworkUrl,
          playLabel: 'Play next chapter',
        }}
      />
      <VideoPlayerScrollPreviewPattern playerProps={playerProps} items={episodeItems} />
    </section>
  </main>
);
