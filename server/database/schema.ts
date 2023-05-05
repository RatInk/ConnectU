export const DB1 = `
CREATE TABLE IF NOT EXISTS Comments (
    comment_id int(11) NOT NULL,
    id_post int(11) NOT NULL,
    username varchar(100) NOT NULL,
    content varchar(1000) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

export const DB2 = `
CREATE TABLE IF NOT EXISTS Posts (
    post_id int(11) NOT NULL,
    username varchar(100) NOT NULL,
    title varchar(100) NOT NULL,
    content varchar(1000) NOT NULL,
    comments int(11) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
export const DB3 = `
CREATE TABLE IF NOT EXISTS Roles (
    Role varchar(10) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

export const DB4 = `
CREATE TABLE IF NOT EXISTS Users (
    username varchar(100) NOT NULL,
    password varchar(300) NOT NULL,
    role varchar(10) NOT NULL DEFAULT 'user'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
export const DB5 = `
CREATE TABLE IF NOT EXISTS user_dislikes (
    username varchar(100) NOT NULL,
    id_post int(11) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`  


export const DB6 = `
CREATE TABLE IF NOT EXISTS user_likes (
    username varchar(100) NOT NULL,
    id_post int(11) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

export const DB7 = `
ALTER TABLE Comments
  ADD PRIMARY KEY (comment_id),
  ADD KEY username (username),
  ADD KEY id_post (id_post);
`

export const DB8 = `
ALTER TABLE Posts
  ADD PRIMARY KEY (post_id),
  ADD KEY user_posts (username),
  ADD KEY comments (comments);
`

export const DB9 = `
INSERT INTO Roles (Role) VALUES
('admin'),
('moderator'),
('user');
`

export const DB10 = `
ALTER TABLE Roles
ADD PRIMARY KEY (Role);
`

export const DB11 = `
ALTER TABLE Users
  ADD PRIMARY KEY (username),
  ADD KEY user_roles (role);
`

export const DB12 = `
ALTER TABLE user_dislikes
  ADD PRIMARY KEY (username,id_post),
  ADD KEY id_post (id_post);
`

export const DB13 = `
ALTER TABLE user_likes
  ADD PRIMARY KEY (username,id_post),
  ADD KEY id_post (id_post);
`

export const DB14 = `
ALTER TABLE Comments
  MODIFY comment_id int(11) NOT NULL AUTO_INCREMENT;
`

export const DB15 = `
ALTER TABLE Posts
  MODIFY post_id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
`

export const DB16 = `
ALTER TABLE Comments
  ADD CONSTRAINT Comments_ibfk_1 FOREIGN KEY (username) REFERENCES Users (username) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT Comments_ibfk_2 FOREIGN KEY (id_post) REFERENCES Posts (post_id) ON DELETE CASCADE ON UPDATE CASCADE;
`
export const DB17 = `
ALTER TABLE Posts
  ADD CONSTRAINT user_posts FOREIGN KEY (username) REFERENCES Users (username) ON DELETE CASCADE ON UPDATE CASCADE;
`

export const DB18 = `
ALTER TABLE Users
  ADD CONSTRAINT user_roles FOREIGN KEY (role) REFERENCES Roles (Role) ON DELETE CASCADE ON UPDATE CASCADE;
`

export const DB19 = `
ALTER TABLE user_dislikes
  ADD CONSTRAINT user_dislikes_ibfk_1 FOREIGN KEY (username) REFERENCES Users (username) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT user_dislikes_ibfk_2 FOREIGN KEY (id_post) REFERENCES Posts (post_id) ON DELETE CASCADE ON UPDATE CASCADE;
`

export const DB20 = `
ALTER TABLE user_likes
  ADD CONSTRAINT user_likes_ibfk_1 FOREIGN KEY (username) REFERENCES Users (username) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT user_likes_ibfk_2 FOREIGN KEY (id_post) REFERENCES Posts (post_id) ON DELETE CASCADE ON UPDATE CASCADE;
`