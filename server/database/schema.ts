export const DB4 = `
CREATE TABLE IF NOT EXISTS Comments (
    comment_id int(11) NOT NULL AUTO_INCREMENT,
    id_post int(11) NOT NULL,
    username varchar(100) NOT NULL,
    content varchar(1000) NOT NULL,
    PRIMARY KEY (comment_id),
    KEY username (username),
    KEY id_post (id_post),
    FOREIGN KEY (username) REFERENCES Users (username),
    FOREIGN KEY (id_post) REFERENCES Posts (post_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

export const DB3 = `
CREATE TABLE IF NOT EXISTS Posts (
    post_id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(100) NOT NULL,
    title varchar(100) NOT NULL,
    content varchar(1000) NOT NULL,
    PRIMARY KEY (post_id),
    KEY user_posts (username),
    FOREIGN KEY (username) REFERENCES Users (username)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

export const DB1 = `
CREATE TABLE IF NOT EXISTS Roles (
    Role varchar(10) NOT NULL,
    PRIMARY KEY (Role)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

export const DB2 = `
CREATE TABLE IF NOT EXISTS Users (
    username varchar(100) NOT NULL,
    password varchar(300) NOT NULL,
    role varchar(10) NOT NULL DEFAULT 'user',
    PRIMARY KEY (username),
    KEY user_roles (role),
    FOREIGN KEY (role) REFERENCES Roles (Role)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
export const DB5 = `
CREATE TABLE IF NOT EXISTS user_dislikes (
    username varchar(100) NOT NULL,
    id_post int(11) NOT NULL,
    PRIMARY KEY (username,id_post),
    KEY id_post (id_post),
    FOREIGN KEY (username) REFERENCES Users (username),
    FOREIGN KEY (id_post) REFERENCES Posts (post_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`  


export const DB6 = `
CREATE TABLE IF NOT EXISTS user_likes (
    username varchar(100) NOT NULL,
    id_post int(11) NOT NULL,
    PRIMARY KEY (username,id_post),
    KEY id_post (id_post),
    FOREIGN KEY (username) REFERENCES Users (username),
    FOREIGN KEY (id_post) REFERENCES Posts (post_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

export const DB7 = `
INSERT INTO Roles (Role) VALUES
('admin'),
('moderator'),
('user');
`